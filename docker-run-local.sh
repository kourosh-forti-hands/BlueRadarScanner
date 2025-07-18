#!/bin/bash

# Local Docker deployment - builds on host, runs in container

echo "🐳 Building BLE Scanner locally, then running in Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Build locally first to avoid container build issues
echo "🔨 Building application locally..."
npm cache clean --force
npm install --no-optional
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Local build failed. Check Node.js version (needs 20+)"
    exit 1
fi

# Create a simple docker-compose for pre-built app
cat > docker-compose.local.yml << 'EOF'
services:
  app:
    image: node:20-slim
    working_dir: /app
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://ble_user:ble_password@db:5432/ble_scanner
    depends_on:
      - db
    volumes:
      - ./dist:/app/dist:ro
      - ./package.json:/app/package.json:ro
      - ./node_modules:/app/node_modules:ro
    command: ["node", "dist/index.js"]
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

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.local.yml down 2>/dev/null || true

# Start services
echo "🚀 Starting containerized services..."
docker-compose -f docker-compose.local.yml up -d

# Wait and check
echo "⏳ Waiting for services to start..."
sleep 10

if docker-compose -f docker-compose.local.yml ps | grep -q "Up"; then
    echo "✅ Services started successfully!"
    echo "🌐 Application URL: http://localhost:5000"
    echo "📋 Management commands:"
    echo "   Logs: docker-compose -f docker-compose.local.yml logs -f"
    echo "   Stop: docker-compose -f docker-compose.local.yml down"
    echo "   Status: docker-compose -f docker-compose.local.yml ps"
else
    echo "❌ Service start failed. Check logs:"
    docker-compose -f docker-compose.local.yml logs
fi