import { NextRequest, NextResponse } from 'next/server';
import { ImageOptimizationService } from '@/lib/images/optimization';
import { LocalImageService } from '@/lib/images/local';

export async function POST(request: NextRequest) {
  try {
    // Check authentication - you can add your auth check here
    // const user = await getAuthenticatedUser(request);
    // if (!user || !['admin', 'editor'].includes(user.role)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const optimize = formData.get('optimize') !== 'false'; // Default to true

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    const validation = ImageOptimizationService.validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (optimize) {
      // Use the new optimization service
      const result = await ImageOptimizationService.optimizeImage(file, {
        quality: 85,
        generateAvif: true,
        maxWidth: 1920,
        maxHeight: 1080,
      });

      // Calculate savings
      const webpSavings = ImageOptimizationService.calculateSavings(
        result.original.size, 
        result.webp.size
      );

      const avifSavings = result.avif 
        ? ImageOptimizationService.calculateSavings(result.original.size, result.avif.size)
        : null;

      return NextResponse.json({
        success: true,
        url: result.webp.url, // Return WebP as primary URL
        originalUrl: result.original.url,
        webpUrl: result.webp.url,
        avifUrl: result.avif?.url,
        metadata: result.metadata,
        optimization: {
          originalSize: result.original.size,
          webpSize: result.webp.size,
          avifSize: result.avif?.size,
          webpSavings,
          avifSavings,
        },
        path: result.webp.path
      });
    } else {
      // Fall back to original service for non-optimized uploads
      const result = await LocalImageService.uploadImage(file);
      return NextResponse.json({
        success: true,
        url: result.url,
        path: result.path
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Optional: Handle multiple file uploads
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files: File[] = [];

    // Extract all files from form data
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file') && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Upload all files to /pic directory
    const results = await LocalImageService.uploadMultipleImages(files);

    return NextResponse.json({
      success: true,
      uploads: results
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

// Handle image deletion
export async function DELETE(request: NextRequest) {
  try {
    const { path: imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json({ error: 'No image path provided' }, { status: 400 });
    }

    const success = await LocalImageService.deleteImage(imagePath);

    return NextResponse.json({
      success,
      message: success ? 'Image deleted successfully' : 'Image not found'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
