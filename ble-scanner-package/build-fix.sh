#!/bin/bash

# Fix for Docker build issues on ARM64 Macs

echo "🔧 Fixing Docker build issues for macOS ARM64..."

# Clean Docker cache and containers aggressively
echo "🧹 Cleaning Docker environment..."
docker-compose -f docker-compose.mac.yml down -v --remove-orphans
docker system prune -af --volumes
docker builder prune -af

# Remove problematic files that cause architecture conflicts
echo "📦 Cleaning build artifacts..."
rm -rf node_modules package-lock.json dist/ .npm/
find . -name "*.node" -delete
npm cache clean --force

# Force platform-specific rebuild
echo "🔄 Installing platform-specific dependencies..."
npm install --no-package-lock

# Remove any cached Rollup binaries
echo "🗑️  Removing cached Rollup binaries..."
rm -rf node_modules/@rollup/rollup-*

# Build with ARM64-specific Dockerfile
echo "🏗️  Building with ARM64-optimized Dockerfile..."
DOCKER_BUILDKIT=1 DOCKER_DEFAULT_PLATFORM=linux/arm64 docker-compose -f docker-compose.mac.yml build --no-cache --force-rm

if [ $? -eq 0 ]; then
    echo "✅ Build fix completed successfully!"
    echo "🚀 Now run: ./docker-run-mac.sh"
else
    echo "❌ Build still failing. Trying alternative approach..."
    echo "📋 Manual steps:"
    echo "   1. Ensure Docker Desktop is updated"
    echo "   2. Enable 'Use Rosetta for x86/amd64 emulation' in Docker settings"
    echo "   3. Try: docker-compose -f docker-compose.mac.yml up --build"
fi