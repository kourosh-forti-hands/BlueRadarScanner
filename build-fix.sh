#!/bin/bash

# Fix for Docker build issues on ARM64 Macs

echo "🔧 Fixing Docker build issues for macOS..."

# Clean Docker cache and containers
echo "🧹 Cleaning Docker environment..."
docker-compose -f docker-compose.mac.yml down -v
docker system prune -af
docker volume prune -f

# Remove node_modules and package-lock to avoid architecture conflicts
echo "📦 Cleaning npm cache..."
rm -rf node_modules package-lock.json
npm cache clean --force

# Regenerate package-lock.json for current platform
echo "🔄 Regenerating package-lock.json..."
npm install

# Build with multi-arch support
echo "🏗️  Building with multi-architecture support..."
DOCKER_BUILDKIT=1 docker-compose -f docker-compose.mac.yml build --no-cache

echo "✅ Build fix completed! Now try running:"
echo "   ./docker-run-mac.sh"