#!/bin/bash

# BLE Scanner Packaging Script
# Creates a production-ready package for local hosting

echo "📦 Creating BLE Scanner package..."

# Create package directory
PACKAGE_DIR="ble-scanner-package"
rm -rf $PACKAGE_DIR
mkdir -p $PACKAGE_DIR

# Copy necessary files
echo "📁 Copying files..."
cp -r client $PACKAGE_DIR/
cp -r server $PACKAGE_DIR/
cp -r shared $PACKAGE_DIR/
cp package.json $PACKAGE_DIR/
cp package-lock.json $PACKAGE_DIR/
cp tsconfig.json $PACKAGE_DIR/
cp vite.config.ts $PACKAGE_DIR/
cp tailwind.config.ts $PACKAGE_DIR/
cp postcss.config.js $PACKAGE_DIR/
cp components.json $PACKAGE_DIR/
cp drizzle.config.ts $PACKAGE_DIR/
cp .env.example $PACKAGE_DIR/
cp ecosystem.config.js $PACKAGE_DIR/
cp Dockerfile $PACKAGE_DIR/
cp docker-compose.yml $PACKAGE_DIR/
cp docker-compose.mac.yml $PACKAGE_DIR/
cp docker-compose.dev.yml $PACKAGE_DIR/
cp docker-run-mac.sh $PACKAGE_DIR/
cp deploy.sh $PACKAGE_DIR/
cp README.md $PACKAGE_DIR/
cp QUICK_START.md $PACKAGE_DIR/
cp DOCKER_SETUP.md $PACKAGE_DIR/

# Create logs directory
mkdir -p $PACKAGE_DIR/logs

# Create .gitignore
cat > $PACKAGE_DIR/.gitignore << 'EOF'
node_modules/
dist/
.env
logs/
*.log
.DS_Store
EOF

# Make scripts executable
chmod +x $PACKAGE_DIR/deploy.sh

# Create archive
echo "🗜️  Creating archive..."
tar -czf ble-scanner-local-hosting.tar.gz $PACKAGE_DIR

echo "✅ Package created successfully!"
echo "📄 Package contents:"
echo "   - Application source code"
echo "   - Deployment scripts"
echo "   - Docker configuration"
echo "   - Documentation"
echo ""
echo "📦 Archive: ble-scanner-local-hosting.tar.gz"
echo "📁 Directory: $PACKAGE_DIR/"
echo ""
echo "🚀 To deploy on a new machine:"
echo "   1. Extract: tar -xzf ble-scanner-local-hosting.tar.gz"
echo "   2. Enter: cd $PACKAGE_DIR"
echo "   3. Deploy: ./deploy.sh"
echo ""
echo "📋 Package size: $(du -h ble-scanner-local-hosting.tar.gz | cut -f1)"