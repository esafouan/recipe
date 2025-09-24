import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from './config';
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

export class ImageService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif'
  ];

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

  // Generate optimized filename
  static generateFileName(originalName: string, folder: string = 'recipes'): string {
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const randomId = nanoid(8);
    return `${folder}/${timestamp}-${randomId}.${extension}`;
  }

  // Upload single image with progress tracking
  static async uploadImage(
    file: File,
    folder: string = 'recipes',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ url: string; path: string }> {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const fileName = this.generateFileName(file.name, folder);
    const storageRef = ref(storage, fileName);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (onProgress) {
            const progress: UploadProgress = {
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              state: snapshot.state as UploadProgress['state']
            };
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadURL,
              path: fileName
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  // Upload multiple images
  static async uploadMultipleImages(
    files: File[],
    folder: string = 'recipes',
    onProgress?: (fileName: string, progress: UploadProgress) => void
  ): Promise<Array<{ url: string; path: string; originalName: string }>> {
    const uploadPromises = files.map(async (file) => {
      const result = await this.uploadImage(
        file,
        folder,
        onProgress ? (progress) => onProgress(file.name, progress) : undefined
      );
      
      return {
        ...result,
        originalName: file.name
      };
    });

    return Promise.all(uploadPromises);
  }

  // Delete image
  static async deleteImage(imagePath: string): Promise<void> {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  }

  // Delete multiple images
  static async deleteMultipleImages(imagePaths: string[]): Promise<void> {
    const deletePromises = imagePaths.map(path => this.deleteImage(path));
    await Promise.all(deletePromises);
  }

  // List images in folder
  static async listImages(folder: string = 'recipes'): Promise<ImageMetadata[]> {
    const folderRef = ref(storage, folder);
    const result = await listAll(folderRef);

    const metadataPromises = result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      const metadata = await getMetadata(itemRef);
      
      return {
        name: itemRef.name,
        url,
        fullPath: itemRef.fullPath,
        size: metadata.size,
        contentType: metadata.contentType || 'unknown',
        timeCreated: metadata.timeCreated
      };
    });

    return Promise.all(metadataPromises);
  }

  // Resize and optimize image (client-side)
  static async resizeImage(
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 800,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Generate responsive image sizes
  static async generateResponsiveSizes(file: File): Promise<{
    thumbnail: File;
    medium: File;
    large: File;
    original: File;
  }> {
    const [thumbnail, medium, large] = await Promise.all([
      this.resizeImage(file, 300, 200, 0.8),
      this.resizeImage(file, 600, 400, 0.85),
      this.resizeImage(file, 1200, 800, 0.9)
    ]);

    return {
      thumbnail,
      medium,
      large,
      original: file
    };
  }
}
