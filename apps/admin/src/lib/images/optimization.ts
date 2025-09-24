import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

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

export class ImageOptimizationService {
  private static readonly DEFAULT_OPTIONS: ImageOptimizationOptions = {
    quality: 85,
    generateAvif: true,
    maxWidth: 1920,
    maxHeight: 1080,
    progressive: true,
  };

  private static readonly UPLOAD_DIR = '/pictures';
  private static readonly SHARED_PUBLIC_DIR = path.join(
    process.cwd(), 
    '../../shared/public/pictures'
  );
  private static readonly BLOG_PUBLIC_DIR = path.join(
    process.cwd(),
    '../recipe-blog/public/pictures'
  );

  // Helper method to ensure directory exists
  private static async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
  }

  // Generate unique filename without extension
  private static generateBaseFileName(originalName: string): string {
    const name = path.basename(originalName, path.extname(originalName));
    const timestamp = Date.now();
    const uniqueId = nanoid(8);
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    return `${sanitizedName}-${timestamp}-${uniqueId}`;
  }

  // Optimize and convert image to multiple formats
  static async optimizeImage(
    file: File,
    options: Partial<ImageOptimizationOptions> = {}
  ): Promise<OptimizedImageResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    // Setup paths - save to both shared and blog directories
    const baseFileName = this.generateBaseFileName(file.name);
    const uploadPath = path.join(process.cwd(), 'public', 'pictures');
    const blogPath = this.BLOG_PUBLIC_DIR;
    
    // Ensure directories exist
    await Promise.all([
      this.ensureDirectoryExists(uploadPath),
      this.ensureDirectoryExists(blogPath)
    ]);

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
        const ratio = Math.min(opts.maxWidth / metadata.width, opts.maxHeight / metadata.height);
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
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Generate optimized original format
    const originalExt = this.getOptimalFormat(file.type);
    const originalFileName = `${baseFileName}.${originalExt}`;
    const originalPath = path.join(uploadPath, originalFileName);
    const originalBlogPath = path.join(blogPath, originalFileName);
    
    let originalBuffer: Buffer;
    if (originalExt === 'jpg' || originalExt === 'jpeg') {
      originalBuffer = await pipeline
        .jpeg({ 
          quality: opts.quality, 
          progressive: opts.progressive,
          mozjpeg: true 
        })
        .toBuffer();
    } else if (originalExt === 'png') {
      originalBuffer = await pipeline
        .png({ 
          quality: opts.quality,
          progressive: opts.progressive,
          compressionLevel: 9 
        })
        .toBuffer();
    } else {
      // Fallback to JPEG for other formats
      originalBuffer = await pipeline
        .jpeg({ 
          quality: opts.quality, 
          progressive: opts.progressive,
          mozjpeg: true 
        })
        .toBuffer();
    }

    // Generate WebP version
    const webpFileName = `${baseFileName}.webp`;
    const webpPath = path.join(uploadPath, webpFileName);
    const webpBlogPath = path.join(blogPath, webpFileName);
    const webpBuffer = await pipeline.clone()
      .webp({ 
        quality: opts.quality,
        effort: 6 // High effort for better compression
      })
      .toBuffer();

    // Generate AVIF version (optional)
    let avifBuffer: Buffer | null = null;
    let avifFileName: string | null = null;
    let avifPath: string | null = null;
    let avifBlogPath: string | null = null;

    if (opts.generateAvif) {
      try {
        avifFileName = `${baseFileName}.avif`;
        avifPath = path.join(uploadPath, avifFileName);
        avifBlogPath = path.join(blogPath, avifFileName);
        avifBuffer = await pipeline.clone()
          .avif({ 
            quality: opts.quality - 5, // Slightly lower quality for AVIF
            effort: 9 // Maximum effort for best compression
          })
          .toBuffer();
      } catch (error) {
        console.warn('AVIF generation failed, skipping:', error);
        // Continue without AVIF if it fails
      }
    }

    // Write all files to both admin and blog directories
    const writePromises = [
      // Admin directory
      writeFile(originalPath, originalBuffer),
      writeFile(webpPath, webpBuffer),
      // Blog directory
      writeFile(originalBlogPath, originalBuffer),
      writeFile(webpBlogPath, webpBuffer),
    ];

    // Add AVIF files if generated
    if (avifBuffer && avifPath && avifBlogPath) {
      writePromises.push(
        writeFile(avifPath, avifBuffer),
        writeFile(avifBlogPath, avifBuffer)
      );
    }

    await Promise.all(writePromises);

    // Calculate final dimensions
    const finalMetadata = await sharp(originalBuffer).metadata();

    const result: OptimizedImageResult = {
      original: {
        url: `/pictures/${originalFileName}`,
        path: originalPath,
        size: originalBuffer.length,
      },
      webp: {
        url: `/pictures/${webpFileName}`,
        path: webpPath,
        size: webpBuffer.length,
      },
      metadata: {
        width: finalMetadata.width || 0,
        height: finalMetadata.height || 0,
        format: originalExt,
        quality: opts.quality,
      }
    };

    // Add AVIF if generated
    if (avifBuffer && avifFileName) {
      result.avif = {
        url: `/pictures/${avifFileName}`,
        path: avifPath!,
        size: avifBuffer.length,
      };
    }

    return result;
  }

  // Get optimal format based on input
  private static getOptimalFormat(mimeType: string): string {
    switch (mimeType) {
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      case 'image/avif':
        return 'avif';
      case 'image/jpeg':
      case 'image/jpg':
      default:
        return 'jpg';
    }
  }

  // Generate responsive image metadata for different screen sizes
  static async generateResponsiveImages(
    file: File,
    sizes: number[] = [640, 768, 1024, 1280, 1920]
  ): Promise<{ [size: number]: OptimizedImageResult }> {
    const results: { [size: number]: OptimizedImageResult } = {};

    for (const size of sizes) {
      try {
        const result = await this.optimizeImage(file, {
          maxWidth: size,
          maxHeight: Math.round(size * 0.75), // 4:3 aspect ratio
          quality: size <= 768 ? 80 : 85, // Lower quality for smaller images
        });
        results[size] = result;
      } catch (error) {
        console.error(`Failed to generate ${size}px version:`, error);
      }
    }

    return results;
  }

  // Calculate compression savings
  static calculateSavings(originalSize: number, optimizedSize: number): {
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
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/avif'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload JPEG, PNG, WebP, or AVIF images.'
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Maximum size is 10MB.'
      };
    }

    return { valid: true };
  }
}
