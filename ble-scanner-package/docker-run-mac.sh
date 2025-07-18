#!/bin/bash

# Docker deployment script for macOS with Bluetooth support

echo "🐳 Starting BLE Scanner with Docker on macOS..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.mac.yml down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.mac.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose -f docker-compose.mac.yml ps | grep -q "Up"; then
    echo "✅ Services started successfully!"
    echo ""
    echo "🌐 Application URL: http://localhost:5000"
    echo "🗄️  Database: PostgreSQL on localhost:5432"
    echo ""
    echo "📋 Management Commands:"
    echo "   View logs: docker-compose -f docker-compose.mac.yml logs -f"
    echo "   Stop: docker-compose -f docker-compose.mac.yml down"
    echo "   Restart: docker-compose -f docker-compose.mac.yml restart"
    echo "   Status: docker-compose -f docker-compose.mac.yml ps"
    echo ""
    echo "🔍 Bluetooth Status:"
    echo "   Check container: docker-compose -f docker-compose.mac.yml exec app hciconfig"
    echo "   View app logs: docker-compose -f docker-compose.mac.yml logs app"
else
    echo "❌ Failed to start services. Check logs:"
    docker-compose -f docker-compose.mac.yml logs
    exit 1
fi

echo ""
echo "📱 Bluetooth Setup Notes:"
echo "1. Enable Bluetooth on your MacBook Pro"
echo "2. The app will use Web Bluetooth API through your browser"
echo "3. Use Chrome/Edge for full Bluetooth support"
echo "4. Demo mode available for testing without real devices"