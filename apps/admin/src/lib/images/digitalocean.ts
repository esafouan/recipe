import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { nanoid } from "nanoid";
import path from "path";

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
  state: "running" | "paused" | "success" | "canceled" | "error";
}

export interface ImageMetadata {
  url: string;
  path: string;
  fileName: string;
  size: number;
  contentType: string;
  uploadedAt: Date;
}

export class DigitalOceanImageService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  private static s3Client: S3Client | null = null;

  // Initialize S3 client for DigitalOcean Spaces
  private static getS3Client(): S3Client {
    if (!this.s3Client) {
      this.s3Client = new S3Client({
        endpoint: process.env.DO_SPACES_ENDPOINT,
        region: process.env.DO_SPACES_REGION || "sfo3",
        credentials: {
          accessKeyId: process.env.DO_SPACES_KEY!,
          secretAccessKey: process.env.DO_SPACES_SECRET!,
        },
        forcePathStyle: false, // DigitalOcean Spaces uses virtual-hosted-style URLs
      });
    }
    return this.s3Client;
  }

  // Validate file before upload
  static validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error:
          "Invalid file type. Please upload JPEG, PNG, WebP, or AVIF images.",
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: "File size too large. Maximum size is 10MB.",
      };
    }

    return { valid: true };
  }

  // Generate unique filename
  private static generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const timestamp = Date.now();
    const uniqueId = nanoid(8);
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

    return `${sanitizedName}-${timestamp}-${uniqueId}${ext}`;
  }

  // Get content type from filename
  private static getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".avif": "image/avif",
    };
    return mimeTypes[ext] || "image/jpeg";
  }

  // Generate CDN URL
  private static generateCdnUrl(fileName: string): string {
    const cdnEndpoint = process.env.DO_SPACES_CDN_ENDPOINT;
    if (cdnEndpoint) {
      // CDN endpoint should already include bucket name
      return `${cdnEndpoint}/${fileName}`;
    }
    // Fallback to direct endpoint if CDN is not configured
    const bucket = process.env.DO_SPACES_BUCKET;
    const region = process.env.DO_SPACES_REGION || "sfo3";
    return `https://${bucket}.${region}.digitaloceanspaces.com/${fileName}`;
  }

  // Upload single image with progress tracking
  static async uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    folder: string = "pictures"
  ): Promise<{ url: string; path: string }> {
    console.log("DigitalOceanImageService: Starting upload");
    console.log("File:", file.name, "Size:", file.size, "Type:", file.type);
    console.log("Folder:", folder);

    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate filename and key
    const fileName = this.generateFileName(file.name);
    const key = `${folder}/${fileName}`;
    const contentType = this.getContentType(fileName);

    console.log("Generated fileName:", fileName);
    console.log("Generated key:", key);
    console.log("Content type:", contentType);

    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const s3Client = this.getS3Client();
      const bucketName = process.env.DO_SPACES_BUCKET!;

      console.log("S3Client config:");
      console.log("- Bucket:", bucketName);
      console.log("- Endpoint:", process.env.DO_SPACES_ENDPOINT);
      console.log("- Region:", process.env.DO_SPACES_REGION);

      // Use Upload from @aws-sdk/lib-storage for progress tracking
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          ACL: "public-read", // Make the file publicly accessible
          CacheControl: "max-age=31536000", // Cache for 1 year
        },
      });

      // Track upload progress
      if (onProgress) {
        upload.on("httpUploadProgress", (progress) => {
          const percent = progress.total
            ? (progress.loaded! / progress.total) * 100
            : 0;
          onProgress({
            progress: percent,
            bytesTransferred: progress.loaded || 0,
            totalBytes: progress.total || file.size,
            state: "running",
          });
        });
      }

      // Perform the upload
      await upload.done();

      // Generate CDN URL
      const cdnUrl = this.generateCdnUrl(key);

      // Final progress update
      if (onProgress) {
        onProgress({
          progress: 100,
          bytesTransferred: file.size,
          totalBytes: file.size,
          state: "success",
        });
      }

      return {
        url: cdnUrl,
        path: key,
      };
    } catch (error) {
      if (onProgress) {
        onProgress({
          progress: 0,
          bytesTransferred: 0,
          totalBytes: file.size,
          state: "error",
        });
      }
      throw new Error(
        `Failed to upload image to DigitalOcean Spaces: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Upload multiple images
  static async uploadMultipleImages(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void,
    folder: string = "pictures"
  ): Promise<Array<{ url: string; path: string }>> {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(
        file,
        onProgress ? (progress) => onProgress(index, progress) : undefined,
        folder
      )
    );

    return Promise.all(uploadPromises);
  }

  // Delete image from DigitalOcean Spaces
  static async deleteImage(imagePath: string): Promise<boolean> {
    try {
      const s3Client = this.getS3Client();
      const bucketName = process.env.DO_SPACES_BUCKET!;

      // Remove leading slash if present
      const key = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      await s3Client.send(command);
      return true;
    } catch (error) {
      console.error("Error deleting image from DigitalOcean Spaces:", error);
      return false;
    }
  }

  // Get image metadata (for admin purposes)
  static async getImageMetadata(
    imagePath: string
  ): Promise<ImageMetadata | null> {
    try {
      // For DigitalOcean Spaces, we'll return basic metadata
      // You could extend this to fetch actual metadata from the object if needed
      const fileName = path.basename(imagePath);
      const url = this.generateCdnUrl(imagePath);

      return {
        url,
        path: imagePath,
        fileName,
        size: 0, // Would need to fetch from DO Spaces to get actual size
        contentType: this.getContentType(fileName),
        uploadedAt: new Date(),
      };
    } catch (error) {
      console.error("Error getting image metadata:", error);
      return null;
    }
  }

  // Generate a signed URL for private access (if needed in the future)
  static async generateSignedUrl(imagePath: string): Promise<string> {
    try {
      // For public files, we just return the CDN URL
      // If you need private files in the future, you can use getSignedUrl from @aws-sdk/s3-request-presigner
      return this.generateCdnUrl(imagePath);
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new Error("Failed to generate signed URL");
    }
  }
}
