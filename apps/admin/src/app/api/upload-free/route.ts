import { NextRequest, NextResponse } from "next/server";
import { DigitalOceanImageService } from "@/lib/images/digitalocean";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    // All images now go to /pic directory regardless of folder parameter

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    const validation = DigitalOceanImageService.validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Upload file to DigitalOcean Spaces
    const result = await DigitalOceanImageService.uploadImage(
      file,
      undefined,
      "pictures"
    );

    return NextResponse.json({
      success: true,
      url: result.url,
      path: result.path,
      optimization: {
        compressionInfo:
          "Uploaded to DigitalOcean Spaces CDN for optimal performance",
      },
    });
  } catch (error) {
    console.error("Free upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle multiple file uploads
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files: File[] = [];
    // All images now go to /pic directory

    // Extract all files from form data
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file") && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Upload all files to DigitalOcean Spaces
    const results = await DigitalOceanImageService.uploadMultipleImages(
      files,
      undefined,
      "pictures"
    );

    return NextResponse.json({
      success: true,
      uploads: results,
      summary: {
        totalFiles: results.length,
        note: "All images uploaded to DigitalOcean Spaces CDN for optimal performance",
      },
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Delete image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get("path");

    if (!imagePath) {
      return NextResponse.json(
        { error: "Image path required" },
        { status: 400 }
      );
    }

    const success = await DigitalOceanImageService.deleteImage(imagePath);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Image deleted successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
