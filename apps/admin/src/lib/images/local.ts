import { writeFile, mkdir, unlink, stat, readdir, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error';
}

export interface ImageMetadata {
  name: string;
  url: string;
  fullPath: string;
  size: number;
  contentType: string;
  timeCreated: string;
}

export class LocalImageService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/avif'
  ];
  private static readonly UPLOAD_DIR = '/pic';

  // Validate file before upload
  static validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload JPEG, PNG, WebP, or AVIF images.'
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'File size too large. Maximum size is 10MB.'
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
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    return `${sanitizedName}-${timestamp}-${uniqueId}${ext}`;
  }

  // Upload single image with progress tracking
  static async uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ url: string; path: string }> {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate filename and paths
    const fileName = this.generateFileName(file.name);
    const uploadPath = path.join(process.cwd(), 'public', 'pictures');
    const filePath = path.join(uploadPath, fileName);
    const publicUrl = `/pictures/${fileName}`;

    try {
      // Ensure directory exists
      if (!existsSync(uploadPath)) {
        await mkdir(uploadPath, { recursive: true });
      }

      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Simulate progress for consistency with Firebase Storage API
      if (onProgress) {
        onProgress({
          progress: 0,
          bytesTransferred: 0,
          totalBytes: buffer.length,
          state: 'running'
        });

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          onProgress({
            progress: 50,
            bytesTransferred: buffer.length / 2,
            totalBytes: buffer.length,
            state: 'running'
          });
        }, 100);

        setTimeout(() => clearInterval(progressInterval), 200);
      }

      // Write file to disk
      await writeFile(filePath, buffer);

      // Auto-sync to frontend (for development/monorepo setup)
      await this.syncToFrontend(filePath, fileName);

      // Final progress update
      if (onProgress) {
        onProgress({
          progress: 100,
          bytesTransferred: buffer.length,
          totalBytes: buffer.length,
          state: 'success'
        });
      }

      return {
        url: publicUrl,
        path: filePath
      };

    } catch (error) {
      if (onProgress) {
        onProgress({
          progress: 0,
          bytesTransferred: 0,
          totalBytes: file.size,
          state: 'error'
        });
      }
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Upload multiple images
  static async uploadMultipleImages(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<Array<{ url: string; path: string }>> {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file, onProgress ? (progress) => onProgress(index, progress) : undefined)
    );

    return Promise.all(uploadPromises);
  }

  // Delete image (optional - for cleanup)
  static async deleteImage(imagePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      
      if (existsSync(fullPath)) {
        await unlink(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Get image metadata (for admin purposes)
  static async getImageMetadata(imagePath: string): Promise<ImageMetadata | null> {
    try {
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      
      if (!existsSync(fullPath)) {
        return null;
      }

      const stats = await stat(fullPath);
      
      return {
        name: path.basename(imagePath),
        url: imagePath,
        fullPath: fullPath,
        size: stats.size,
        contentType: this.getContentType(imagePath),
        timeCreated: stats.birthtime.toISOString()
      };
    } catch (error) {
      console.error('Error getting image metadata:', error);
      return null;
    }
  }

  // Helper method to determine content type
  private static getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.avif': 'image/avif'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  // Sync uploaded image to frontend (for monorepo development)
  private static async syncToFrontend(sourcePath: string, fileName: string): Promise<void> {
    try {
      // Calculate frontend path
      const frontendPublicPath = path.resolve(process.cwd(), '..', 'recipe-blog', 'public', 'pictures');
      const frontendFilePath = path.join(frontendPublicPath, fileName);

      // Ensure frontend directory exists
      if (!existsSync(frontendPublicPath)) {
        await mkdir(frontendPublicPath, { recursive: true });
      }

      // Copy file to frontend
      await copyFile(sourcePath, frontendFilePath);
      console.log(`✅ Image synced to frontend: /pictures/${fileName}`);
    } catch (error) {
      // Don't throw error if sync fails - it's optional for development
      console.warn(`⚠️ Could not sync image to frontend:`, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // List all images in the /pictures directory
  static async listImages(): Promise<ImageMetadata[]> {
    try {
      const uploadPath = path.join(process.cwd(), 'public', 'pictures');
      
      if (!existsSync(uploadPath)) {
        return [];
      }

      const files = await readdir(uploadPath);
      const imageFiles = files.filter((file: string) => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
      });

      const metadataPromises = imageFiles.map((file: string) =>
        this.getImageMetadata(`/pictures/${file}`)
      );

      const results = await Promise.all(metadataPromises);
      return results.filter((metadata): metadata is ImageMetadata => metadata !== null);
    } catch (error) {
      console.error('Error listing images:', error);
      return [];
    }
  }
}
