import { NextRequest, NextResponse } from "next/server";
import { DigitalOceanOptimizationService } from "@/lib/images/digitalocean-optimization";
import { DigitalOceanImageService } from "@/lib/images/digitalocean";

export async function POST(request: NextRequest) {
  try {
    // Debug environment variables (only in development)
    if (process.env.NODE_ENV === "development") {
      console.log("DO_SPACES_ENDPOINT:", process.env.DO_SPACES_ENDPOINT);
      console.log("DO_SPACES_BUCKET:", process.env.DO_SPACES_BUCKET);
      console.log("DO_SPACES_KEY exists:", !!process.env.DO_SPACES_KEY);
      console.log("DO_SPACES_SECRET exists:", !!process.env.DO_SPACES_SECRET);
    }

    // Check authentication - you can add your auth check here
    // const user = await getAuthenticatedUser(request);
    // if (!user || !['admin', 'editor'].includes(user.role)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const optimize = formData.get("optimize") !== "false"; // Default to true

    if (process.env.NODE_ENV === "development") {
      console.log(
        "Received file:",
        file?.name,
        "Size:",
        file?.size,
        "Type:",
        file?.type
      );
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    const validation = DigitalOceanImageService.validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("File validation passed, optimize:", optimize);
    }

    if (optimize) {
      if (process.env.NODE_ENV === "development") {
        console.log("Starting optimization upload...");
      }
      // Use the DigitalOcean optimization service (WebP only)
      const result = await DigitalOceanOptimizationService.optimizeImage(
        file,
        {
          quality: 85,
          generateAvif: false, // Only generate WebP
          maxWidth: 1920,
          maxHeight: 1080,
        },
        "pictures"
      );
      if (process.env.NODE_ENV === "development") {
        console.log("Optimization upload completed successfully");
      }

      // Calculate savings (using original file size vs WebP)
      const originalFileSize = file.size;
      const webpSavings = DigitalOceanOptimizationService.calculateSavings(
        originalFileSize,
        result.webp.size
      );

      return NextResponse.json({
        success: true,
        url: result.webp.url, // Return WebP URL
        webpUrl: result.webp.url,
        metadata: result.metadata,
        optimization: {
          originalSize: originalFileSize,
          webpSize: result.webp.size,
          webpSavings,
          format: "webp",
        },
        path: result.webp.path,
      });
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log("Starting simple upload...");
      }
      // Fall back to DigitalOcean for non-optimized uploads
      const result = await DigitalOceanImageService.uploadImage(file);
      if (process.env.NODE_ENV === "development") {
        console.log("Simple upload completed successfully");
      }
      return NextResponse.json({
        success: true,
        url: result.url,
        path: result.path,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);

    // More detailed error information
    let errorMessage = "Failed to upload image";
    let errorDetails = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || "";
    }

    console.error("Error details:", errorDetails);

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? errorDetails : undefined,
      },
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
      if (key.startsWith("file") && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Upload all files to DigitalOcean Spaces
    const results = await DigitalOceanImageService.uploadMultipleImages(files);

    return NextResponse.json({
      success: true,
      uploads: results,
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}

// Handle image deletion
export async function DELETE(request: NextRequest) {
  try {
    const { path: imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json(
        { error: "No image path provided" },
        { status: 400 }
      );
    }

    const success = await DigitalOceanImageService.deleteImage(imagePath);

    return NextResponse.json({
      success,
      message: success ? "Image deleted successfully" : "Image not found",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
