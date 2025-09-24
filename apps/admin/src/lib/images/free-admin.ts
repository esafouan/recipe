// Free production-ready image service for admin panel
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

// Note: Sharp is built into Next.js, so we'll use a simpler approach for the admin
export interface FreeUploadResult {
  url: string;
  path: string;
  sizes: {
    thumbnail: string;
    medium: string;
    large: string;
  };
  originalSize: number;
  optimizedSize: number;
}

export class AdminFreeImageService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif'
  ];

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

  private static generateFileName(originalName: string): string {
    const ext = path.extname(originalName).toLowerCase();
    const name = path.basename(originalName, ext);
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const timestamp = Date.now();
    const uniqueId = nanoid(8);
    
    return `${sanitizedName}-${timestamp}-${uniqueId}${ext}`;
  }

  // Simplified upload that saves directly to public directories
  static async uploadImage(
    file: File,
    onProgress?: (progress: { progress: number; stage: string }) => void
  ): Promise<FreeUploadResult> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const fileName = this.generateFileName(file.name);
    const publicUrl = `/pictures/${fileName}`;
    
    // Define paths for both apps' public directories
    const adminPublicPath = path.join(process.cwd(), 'public', 'pictures');
    const blogPublicPath = path.resolve(process.cwd(), '..', 'recipe-blog', 'public', 'pictures');
    const sharedPath = path.resolve(process.cwd(), '..', '..', 'apps', 'pictures');

    try {
      // Ensure all directories exist
      if (!existsSync(adminPublicPath)) {
        await mkdir(adminPublicPath, { recursive: true });
      }
      if (!existsSync(blogPublicPath)) {
        await mkdir(blogPublicPath, { recursive: true });
      }
      if (!existsSync(sharedPath)) {
        await mkdir(sharedPath, { recursive: true });
      }

      onProgress?.({ progress: 20, stage: 'Processing image...' });

      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      onProgress?.({ progress: 50, stage: 'Saving to all locations...' });

      // Save to all three locations
      const adminFile = path.join(adminPublicPath, fileName);
      const blogFile = path.join(blogPublicPath, fileName);
      const sharedFile = path.join(sharedPath, fileName);

      await Promise.all([
        writeFile(adminFile, buffer),
        writeFile(blogFile, buffer),
        writeFile(sharedFile, buffer)
      ]);

      onProgress?.({ progress: 100, stage: 'Complete!' });

      console.log(`✅ Image saved to all locations: ${fileName}`);

      return {
        url: publicUrl,
        path: adminFile, // Return admin path as primary
        sizes: {
          thumbnail: publicUrl,
          medium: publicUrl,
          large: publicUrl,
        },
        originalSize: buffer.length,
        optimizedSize: buffer.length,
      };

    } catch (error) {
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async uploadMultipleImages(
    files: File[],
    onProgress?: (fileIndex: number, progress: { progress: number; stage: string }) => void
  ): Promise<FreeUploadResult[]> {
    const results: FreeUploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const result = await this.uploadImage(
        files[i],
        onProgress ? (progress) => onProgress(i, progress) : undefined
      );
      results.push(result);
    }
    
    return results;
  }

  // Delete image from all locations
  static async deleteImage(imagePath: string): Promise<boolean> {
    try {
      const fileName = path.basename(imagePath);
      
      // Paths for all three locations
      const adminPath = path.join(process.cwd(), 'public', 'pictures', fileName);
      const blogPath = path.resolve(process.cwd(), '..', 'recipe-blog', 'public', 'pictures', fileName);
      const sharedPath = path.resolve(process.cwd(), '..', '..', 'apps', 'pictures', fileName);
      
      const fs = await import('fs').then(m => m.promises);
      
      // Delete from all locations (ignore errors for missing files)
      const deletePromises = [adminPath, blogPath, sharedPath].map(async (filePath) => {
        try {
          if (existsSync(filePath)) {
            await fs.unlink(filePath);
            console.log(`🗑️ Deleted: ${filePath}`);
          }
        } catch (error) {
          console.warn(`⚠️ Could not delete ${filePath}:`, error);
        }
      });
      
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }
}
