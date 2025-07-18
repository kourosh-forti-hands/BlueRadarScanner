#!/bin/bash

# Simple Docker deployment for ARM64 Macs - bypasses build issues

echo "🐳 Starting BLE Scanner with pre-built approach..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down -v 2>/dev/null || true

# Use pre-built Node image and build application at runtime
echo "🏗️  Starting with runtime build approach..."

# Create a simple compose file that builds inside the running container
cat > docker-compose.runtime.yml << 'EOF'
services:
  app:
    image: node:20-slim
    working_dir: /workspace
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://ble_user:ble_password@db:5432/ble_scanner
    depends_on:
      - db
    volumes:
      - .:/source:ro
    command: >
      bash -c "
        apt-get update && 
        apt-get install -y curl build-essential python3 &&
        cp -r /source/* /workspace/ &&
        npm cache clean --force &&
        npm install --no-optional &&
        npm run build &&
        npm start
      "
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=ble_scanner
      - POSTGRES_USER=ble_user
      - POSTGRES_PASSWORD=ble_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
EOF

# Start services
docker-compose -f docker-compose.runtime.yml up -d

# Wait for services
echo "⏳ Waiting for application to build and start..."
sleep 30

# Check if running
if docker-compose -f docker-compose.runtime.yml ps | grep -q "Up"; then
    echo "✅ Services started successfully!"
    echo "🌐 Application URL: http://localhost:5000"
    echo "📋 Management:"
    echo "   Logs: docker-compose -f docker-compose.runtime.yml logs -f"
    echo "   Stop: docker-compose -f docker-compose.runtime.yml down"
else
    echo "❌ Service start failed. Check logs:"
    docker-compose -f docker-compose.runtime.yml logs
fi