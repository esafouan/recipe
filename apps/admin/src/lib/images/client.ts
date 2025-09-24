export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error';
}

export interface UploadResult {
  url: string;
  path: string;
  originalUrl?: string;
  webpUrl?: string;
  avifUrl?: string;
  optimization?: {
    originalSize: number;
    webpSize: number;
    avifSize?: number;
    webpSavings: { absoluteSaving: number; percentageSaving: number };
    avifSavings?: { absoluteSaving: number; percentageSaving: number };
  };
  metadata?: {
    width: number;
    height: number;
    format: string;
    quality: number;
  };
}

export class ClientImageService {
  // Upload single image to local storage via API
  static async uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    optimize: boolean = true
  ): Promise<UploadResult> {
    
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('optimize', optimize.toString());

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress({
            progress,
            bytesTransferred: event.loaded,
            totalBytes: event.total,
            state: 'running'
          });
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            if (result.success) {
              if (onProgress) {
                onProgress({
                  progress: 100,
                  bytesTransferred: file.size,
                  totalBytes: file.size,
                  state: 'success'
                });
              }
              resolve({
                url: result.url,
                path: result.path,
                originalUrl: result.originalUrl,
                webpUrl: result.webpUrl,
                avifUrl: result.avifUrl,
                optimization: result.optimization,
                metadata: result.metadata
              });
            } else {
              reject(new Error(result.error || 'Upload failed'));
            }
          } catch {
            reject(new Error('Invalid response from server'));
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: Upload failed`));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        if (onProgress) {
          onProgress({
            progress: 0,
            bytesTransferred: 0,
            totalBytes: file.size,
            state: 'error'
          });
        }
        reject(new Error('Upload failed'));
      });

      // Handle abortion
      xhr.addEventListener('abort', () => {
        if (onProgress) {
          onProgress({
            progress: 0,
            bytesTransferred: 0,
            totalBytes: file.size,
            state: 'canceled'
          });
        }
        reject(new Error('Upload canceled'));
      });

      // Start upload
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  }

  // Upload multiple images
  static async uploadMultipleImages(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(
        file, 
        onProgress ? (progress) => onProgress(index, progress) : undefined
      )
    );

    return Promise.all(uploadPromises);
  }

  // Validate file on client side
  static validateFile(file: File): { valid: boolean; error?: string } {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      'image/jpeg',
      'image/jpg',
      'image/png', 
      'image/webp',
      'image/avif'
    ];

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload JPEG, PNG, WebP, or AVIF images.'
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'File size too large. Maximum size is 10MB.'
      };
    }

    return { valid: true };
  }

  // Delete image (calls backend API)
  static async deleteImage(imagePath: string): Promise<boolean> {
    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: imagePath }),
      });

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }
}
