#!/bin/bash

# Image optimization script for Mini Recipe Blog
echo "🖼️  Optimizing images for production..."

# Create optimized directory if it doesn't exist
mkdir -p public/optimized

# Function to optimize images using imagemagick (if available)
optimize_with_imagemagick() {
    echo "Using ImageMagick for optimization..."
    
    # Convert and optimize JPEG images
    for img in public/*.jpg public/*.jpeg; do
        if [ -f "$img" ]; then
            filename=$(basename "$img" .jpg)
            filename=$(basename "$filename" .jpeg)
            
            # Create optimized versions
            convert "$img" -quality 85 -strip "public/optimized/${filename}.jpg"
            convert "$img" -quality 80 -format webp "public/optimized/${filename}.webp"
            echo "✅ Optimized: $img"
        fi
    done
    
    # Convert and optimize PNG images
    for img in public/*.png; do
        if [ -f "$img" ]; then
            filename=$(basename "$img" .png)
            
            # Create optimized versions
            convert "$img" -quality 90 -strip "public/optimized/${filename}.png"
            convert "$img" -quality 80 -format webp "public/optimized/${filename}.webp"
            echo "✅ Optimized: $img"
        fi
    done
}

# Function to optimize using cwebp (if available)
optimize_with_cwebp() {
    echo "Using cwebp for WebP conversion..."
    
    for img in public/*.jpg public/*.jpeg public/*.png; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            filename="${filename%.*}"
            
            cwebp -q 80 "$img" -o "public/optimized/${filename}.webp"
            echo "✅ Converted to WebP: $img"
        fi
    done
}

# Check for available tools and run optimization
if command -v convert &> /dev/null; then
    optimize_with_imagemagick
elif command -v cwebp &> /dev/null; then
    optimize_with_cwebp
else
    echo "⚠️  No image optimization tools found. Install ImageMagick or cwebp for better performance."
    echo "   brew install imagemagick webp  # macOS"
    echo "   sudo apt-get install imagemagick webp  # Ubuntu"
fi

echo "🎉 Image optimization complete!"
echo "📊 Check public/optimized/ for optimized images"

# Generate image manifest
echo "📋 Generating image manifest..."
cat > public/image-manifest.json << EOF
{
  "optimized": true,
  "formats": ["webp", "jpg", "png"],
  "quality": {
    "webp": 80,
    "jpg": 85,
    "png": 90
  },
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "✅ Image manifest created at public/image-manifest.json"
