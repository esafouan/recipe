#!/bin/bash

echo "🚀 Running comprehensive performance audit for Mini Recipe Blog..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the recipe-blog root directory"
    exit 1
fi

echo "📊 Performance Audit Report - $(date)"
echo "========================================"

# 1. Build Analysis
echo "🏗️  Building for production..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status "Production build successful"
else
    print_error "Production build failed"
    exit 1
fi

# 2. Bundle Size Analysis
echo "📦 Analyzing bundle sizes..."
BUILD_OUTPUT=$(npm run build 2>&1)

# Extract bundle sizes
FIRST_LOAD_JS=$(echo "$BUILD_OUTPUT" | grep "First Load JS shared by all" | awk '{print $7}')
HOMEPAGE_SIZE=$(echo "$BUILD_OUTPUT" | grep "○ /" | awk '{print $4}')

echo "   • First Load JS: $FIRST_LOAD_JS"
echo "   • Homepage Size: $HOMEPAGE_SIZE"

# Check if bundle size is reasonable
if [[ $FIRST_LOAD_JS =~ ([0-9]+) ]]; then
    SIZE_KB=${BASH_REMATCH[1]}
    if [ $SIZE_KB -lt 300 ]; then
        print_status "Bundle size is optimal (< 300KB)"
    elif [ $SIZE_KB -lt 500 ]; then
        print_warning "Bundle size is acceptable but could be improved ($SIZE_KB KB)"
    else
        print_error "Bundle size is too large ($SIZE_KB KB). Consider optimization."
    fi
fi

# 3. Image Optimization Check
echo "🖼️  Checking image optimization..."
IMG_COUNT=$(find public -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" | wc -l)
WEBP_COUNT=$(find public -name "*.webp" | wc -l)

echo "   • Total images: $IMG_COUNT"
echo "   • WebP images: $WEBP_COUNT"

if [ $WEBP_COUNT -gt 0 ]; then
    print_status "WebP images found - good for performance"
else
    print_warning "No WebP images found. Run ./scripts/optimize-images.sh"
fi

# 4. Check for optimized components
echo "🔧 Checking for performance optimizations..."

# Check for Next.js Image usage
IMG_TAGS=$(grep -r "<img" app/ components/ 2>/dev/null | wc -l)
NEXT_IMAGE_TAGS=$(grep -r "from \"next/image\"" app/ components/ 2>/dev/null | wc -l)

if [ $IMG_TAGS -eq 0 ]; then
    print_status "No unoptimized <img> tags found"
elif [ $NEXT_IMAGE_TAGS -gt 0 ]; then
    print_warning "$IMG_TAGS <img> tags found, but Next.js Image is also used"
else
    print_error "$IMG_TAGS unoptimized <img> tags found. Replace with Next.js Image component"
fi

# Check for service worker
if [ -f "public/sw.js" ]; then
    print_status "Service worker implemented for caching"
else
    print_warning "No service worker found. Consider implementing for offline support"
fi

# 5. SEO Check
echo "🔍 Checking SEO optimization..."

# Check for sitemap
if [ -f ".next/server/app/sitemap.xml.body" ] || grep -q "sitemap" app/sitemap.ts 2>/dev/null; then
    print_status "Sitemap generation configured"
else
    print_warning "Sitemap not found or not configured"
fi

# Check for robots.txt
if [ -f "app/robots.txt" ] || [ -f "public/robots.txt" ]; then
    print_status "Robots.txt configured"
else
    print_warning "Robots.txt not found"
fi

# 6. Dependencies Check
echo "📋 Checking dependencies..."
if command -v npm audit &> /dev/null; then
    VULNERABILITIES=$(npm audit --audit-level=moderate 2>/dev/null | grep -c "vulnerability" || echo "0")
    if [ $VULNERABILITIES -eq 0 ]; then
        print_status "No security vulnerabilities found"
    else
        print_warning "$VULNERABILITIES security vulnerabilities found. Run 'npm audit fix'"
    fi
fi

# 7. Generate recommendations
echo ""
echo "📈 Performance Recommendations"
echo "=============================="

if [ $SIZE_KB -gt 300 ]; then
    echo "• Consider implementing dynamic imports for large components"
    echo "• Use next/dynamic for code splitting"
fi

if [ $IMG_COUNT -gt $WEBP_COUNT ]; then
    echo "• Run ./scripts/optimize-images.sh to create WebP versions"
    echo "• Consider using an image CDN like Cloudinary"
fi

if [ ! -f "public/sw.js" ]; then
    echo "• Implement service worker for better caching"
fi

echo "• Monitor Core Web Vitals regularly"
echo "• Use ?perf=true query parameter to enable performance dashboard"
echo "• Run 'npm run analyze' for detailed bundle analysis"

echo ""
echo "🎉 Performance audit complete!"
echo "📊 Summary: Bundle size: ${FIRST_LOAD_JS}, Images: ${IMG_COUNT}, WebP: ${WEBP_COUNT}"
