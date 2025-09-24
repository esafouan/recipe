'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ClientImageService } from '@/lib/images/client';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ImageUploadProps {
  mainImage: string | null;
  additionalImages: string[];
  onImageUploaded: (url: string, isMain?: boolean) => void;
  onImageRemove: (url: string, isMain?: boolean) => void;
  enableOptimization?: boolean;
}

export default function ImageUpload({
  mainImage,
  additionalImages,
  onImageUploaded,
  onImageRemove,
  enableOptimization = true
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [optimizationResults, setOptimizationResults] = useState<{ [key: string]: {
    originalSize: number; 
    webpSize: number; 
    avifSize?: number; 
    webpSavings: { absoluteSaving: number; percentageSaving: number }; 
    avifSavings?: { absoluteSaving: number; percentageSaving: number }; 
  } }>({});

  // Utility function to format bytes
  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const uploadImage = useCallback(async (file: File, isMain: boolean = false) => {
    try {
      setUploading(true);
      const fileId = `${Date.now()}-${file.name}`;
      
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      const result = await ClientImageService.uploadImage(file, (progress) => {
        setUploadProgress(prev => ({ ...prev, [fileId]: progress.progress }));
      }, enableOptimization);

      onImageUploaded(result.url, isMain);
      
      // Store optimization results if available
      if (result.optimization) {
        setOptimizationResults(prev => ({ 
          ...prev, 
          [result.url]: result.optimization!
        }));
        
        const savings = result.optimization.webpSavings.percentageSaving;
        toast.success(
          `${isMain ? 'Main image' : 'Image'} uploaded successfully! WebP saved ${savings.toFixed(1)}% (${formatBytes(result.optimization.webpSavings.absoluteSaving)})`
        );
      } else {
        toast.success(`${isMain ? 'Main image' : 'Image'} uploaded successfully!`);
      }
      
      setUploadProgress(prev => {
        // Remove the completed upload from progress tracking
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [fileId]: _removed, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [onImageUploaded, enableOptimization, formatBytes]);

  const onMainImageDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        uploadImage(acceptedFiles[0], true);
      }
    },
    [uploadImage]
  );

  const onAdditionalImagesDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(file => uploadImage(file, false));
    },
    [uploadImage]
  );

  const {
    getRootProps: getMainRootProps,
    getInputProps: getMainInputProps,
    isDragActive: isMainDragActive,
  } = useDropzone({
    onDrop: onMainImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const {
    getRootProps: getAdditionalRootProps,
    getInputProps: getAdditionalInputProps,
    isDragActive: isAdditionalDragActive,
  } = useDropzone({
    onDrop: onAdditionalImagesDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div className="space-y-6">
      {/* Image Optimization Settings */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-blue-900">Image Optimization</h4>
            <p className="text-xs text-blue-700 mt-1">
              Automatically convert images to WebP and AVIF formats for better performance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableOptimization"
              checked={enableOptimization}
              readOnly
              className="rounded"
            />
            <label htmlFor="enableOptimization" className="text-sm text-blue-900">
              {enableOptimization ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        </div>
        
        {Object.keys(optimizationResults).length > 0 && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <h5 className="text-xs font-medium text-blue-900 mb-2">Optimization Results:</h5>
            <div className="space-y-1">
              {Object.entries(optimizationResults).map(([url, result]) => (
                <div key={url} className="text-xs text-blue-700">
                  <span className="font-medium">WebP:</span> -{result.webpSavings.percentageSaving.toFixed(1)}% 
                  ({formatBytes(result.webpSavings.absoluteSaving)} saved)
                  {result.avifSavings && (
                    <span className="ml-3">
                      <span className="font-medium">AVIF:</span> -{result.avifSavings.percentageSaving.toFixed(1)}%
                      ({formatBytes(result.avifSavings.absoluteSaving)} saved)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Image * (Required)
        </label>
        
        {mainImage ? (
          <div className="relative">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src={mainImage}
                alt="Main recipe image"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => onImageRemove(mainImage, true)}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              Main Image
            </div>
          </div>
        ) : (
          <div
            {...getMainRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isMainDragActive
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <input {...getMainInputProps()} />
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-1">
              {isMainDragActive
                ? 'Drop the main image here'
                : 'Click to upload or drag and drop main image'}
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, WebP up to 5MB
            </p>
          </div>
        )}
      </div>

      {/* Additional Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Images (Optional)
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {additionalImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative h-32 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Additional image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => onImageRemove(image, false)}
                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Add More Button */}
          <div
            {...getAdditionalRootProps()}
            className={`
              h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
              ${isAdditionalDragActive
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <input {...getAdditionalInputProps()} />
            <Plus className="h-6 w-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500 text-center">
              Add More
            </span>
          </div>
        </div>

        {additionalImages.length === 0 && (
          <div
            {...getAdditionalRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isAdditionalDragActive
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <input {...getAdditionalInputProps()} />
            <ImageIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-1">
              {isAdditionalDragActive
                ? 'Drop additional images here'
                : 'Click to upload or drag and drop additional images'}
            </p>
            <p className="text-sm text-gray-500">
              Multiple images allowed, PNG, JPG, WebP up to 5MB each
            </p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploading...</h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
          <span className="text-sm text-gray-600">Uploading images...</span>
        </div>
      )}
    </div>
  );
}
