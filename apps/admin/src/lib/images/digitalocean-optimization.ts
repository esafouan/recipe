import sharp from "sharp";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { nanoid } from "nanoid";
import path from "path";

export interface OptimizedImageResult {
  original: {
    url: string;
    path: string;
    size: number;
  };
  webp: {
    url: string;
    path: string;
    size: number;
  };
  avif?: {
    url: string;
    path: string;
    size: number;
  };
  metadata: {
    width: number;
    height: number;
    format: string;
    quality: number;
  };
}

export interface ImageOptimizationOptions {
  quality: number;
  generateAvif: boolean;
  maxWidth: number;
  maxHeight: number;
  progressive: boolean;
}

export class DigitalOceanOptimizationService {
  private static readonly DEFAULT_OPTIONS: ImageOptimizationOptions = {
    quality: 85,
    generateAvif: false, // Only generate WebP
    maxWidth: 1920,
    maxHeight: 1080,
    progressive: true,
  };

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
        forcePathStyle: false,
      });
    }
    return this.s3Client;
  }

  // Generate unique filename without extension
  private static generateBaseFileName(originalName: string): string {
    const name = path.basename(originalName, path.extname(originalName));
    const timestamp = Date.now();
    const uniqueId = nanoid(8);
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

    return `${sanitizedName}-${timestamp}-${uniqueId}`;
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

  // Get content type from format
  private static getContentType(format: string): string {
    const mimeTypes: { [key: string]: string } = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      avif: "image/avif",
    };
    return mimeTypes[format] || "image/jpeg";
  }

  // Upload buffer to DigitalOcean Spaces
  private static async uploadToSpaces(
    buffer: Buffer,
    key: string,
    contentType: string
  ): Promise<void> {
    const s3Client = this.getS3Client();
    const bucketName = process.env.DO_SPACES_BUCKET!;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: "public-read",
        CacheControl: "max-age=31536000", // Cache for 1 year
      },
    });

    await upload.done();
  }

  // Optimize and convert image to multiple formats, upload to DigitalOcean Spaces
  static async optimizeImage(
    file: File,
    options: Partial<ImageOptimizationOptions> = {},
    folder: string = "pictures"
  ): Promise<OptimizedImageResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    // Generate base filename
    const baseFileName = this.generateBaseFileName(file.name);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Initialize Sharp instance
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    // Calculate resize dimensions if needed
    let resizeOptions: { width?: number; height?: number } | undefined;
    if (metadata.width && metadata.height) {
      if (metadata.width > opts.maxWidth || metadata.height > opts.maxHeight) {
        const ratio = Math.min(
          opts.maxWidth / metadata.width,
          opts.maxHeight / metadata.height
        );
        resizeOptions = {
          width: Math.round(metadata.width * ratio),
          height: Math.round(metadata.height * ratio),
        };
      }
    }

    // Prepare Sharp pipeline
    let pipeline = image;
    if (resizeOptions) {
      pipeline = pipeline.resize(resizeOptions.width, resizeOptions.height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Generate only WebP version - no original or AVIF
    const webpFileName = `${baseFileName}.webp`;
    const webpKey = `${folder}/${webpFileName}`;
    const webpBuffer = await pipeline
      .webp({
        quality: opts.quality,
        effort: 6, // High effort for better compression
      })
      .toBuffer();

    // Upload only WebP file to DigitalOcean Spaces
    await this.uploadToSpaces(webpBuffer, webpKey, this.getContentType("webp"));

    // Calculate final dimensions
    const finalMetadata = await sharp(webpBuffer).metadata();

    const result: OptimizedImageResult = {
      original: {
        url: this.generateCdnUrl(webpKey),
        path: webpKey,
        size: webpBuffer.length,
      },
      webp: {
        url: this.generateCdnUrl(webpKey),
        path: webpKey,
        size: webpBuffer.length,
      },
      metadata: {
        width: finalMetadata.width || 0,
        height: finalMetadata.height || 0,
        format: "webp",
        quality: opts.quality,
      },
    };

    return result;
  }

  // Get optimal format based on input
  private static getOptimalFormat(mimeType: string): string {
    switch (mimeType) {
      case "image/png":
        return "png";
      case "image/webp":
        return "webp";
      case "image/avif":
        return "avif";
      case "image/jpeg":
      case "image/jpg":
      default:
        return "jpg";
    }
  }

  // Generate responsive image metadata for different screen sizes
  static async generateResponsiveImages(
    file: File,
    sizes: number[] = [640, 768, 1024, 1280, 1920],
    folder: string = "pictures"
  ): Promise<{ [size: number]: OptimizedImageResult }> {
    const results: { [size: number]: OptimizedImageResult } = {};

    for (const size of sizes) {
      try {
        const result = await this.optimizeImage(
          file,
          {
            maxWidth: size,
            maxHeight: Math.round(size * 0.75), // 4:3 aspect ratio
            quality: size <= 768 ? 80 : 85, // Lower quality for smaller images
          },
          folder
        );
        results[size] = result;
      } catch (error) {
        console.error(`Failed to generate ${size}px version:`, error);
      }
    }

    return results;
  }

  // Calculate compression savings
  static calculateSavings(
    originalSize: number,
    optimizedSize: number
  ): {
    absoluteSaving: number;
    percentageSaving: number;
  } {
    const absoluteSaving = originalSize - optimizedSize;
    const percentageSaving = (absoluteSaving / originalSize) * 100;

    return {
      absoluteSaving,
      percentageSaving: Math.round(percentageSaving * 100) / 100,
    };
  }

  // Validate image file
  static validateFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error:
          "Invalid file type. Please upload JPEG, PNG, WebP, or AVIF images.",
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File size too large. Maximum size is 10MB.",
      };
    }

    return { valid: true };
  }
}
