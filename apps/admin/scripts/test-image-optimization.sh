#!/bin/bash

# Test script for image optimization in admin panel
echo "🧪 Testing image optimization in admin panel..."

# Check if admin server is running
ADMIN_URL="http://localhost:3001"
if ! curl -s "$ADMIN_URL" > /dev/null; then
    echo "❌ Admin server not running. Start it with: cd apps/admin && npm run dev"
    exit 1
fi

# Create a test image (simple colored rectangle)
TEST_DIR="./test-images"
mkdir -p "$TEST_DIR"

# Create test image using ImageMagick (if available)
if command -v convert &> /dev/null; then
    echo "📸 Creating test image..."
    convert -size 800x600 xc:red "$TEST_DIR/test-image.jpg"
    
    # Test upload endpoint
    echo "🚀 Testing upload endpoint..."
    RESPONSE=$(curl -s -X POST \
        -F "file=@$TEST_DIR/test-image.jpg" \
        -F "optimize=true" \
        "$ADMIN_URL/api/upload")
    
    echo "📊 Upload response:"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    
    # Check if optimized files were created
    if echo "$RESPONSE" | grep -q "webpUrl"; then
        echo "✅ WebP optimization working!"
    else
        echo "❌ WebP optimization failed"
    fi
    
    if echo "$RESPONSE" | grep -q "avifUrl"; then
        echo "✅ AVIF optimization working!"
    else
        echo "⚠️  AVIF optimization not available (this is normal if libavif is not installed)"
    fi
    
    # Check optimization savings
    if echo "$RESPONSE" | grep -q "webpSavings"; then
        SAVINGS=$(echo "$RESPONSE" | jq -r '.optimization.webpSavings.percentageSaving' 2>/dev/null)
        if [ "$SAVINGS" != "null" ] && [ "$SAVINGS" != "" ]; then
            echo "💾 WebP compression saved: ${SAVINGS}%"
        fi
    fi
    
    # Cleanup
    rm -rf "$TEST_DIR"
    
else
    echo "⚠️  ImageMagick not found. Install it to run full test:"
    echo "   brew install imagemagick  # macOS"
    echo "   sudo apt-get install imagemagick  # Ubuntu"
fi

echo "🎉 Image optimization test complete!"
echo ""
echo "📋 Manual testing steps:"
echo "1. Go to $ADMIN_URL"
echo "2. Create a new recipe"
echo "3. Upload an image in the image upload section"
echo "4. Check the optimization results panel"
echo "5. Verify WebP/AVIF versions are created in public/pictures/"
