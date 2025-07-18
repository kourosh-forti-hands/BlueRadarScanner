#!/bin/bash

# BLE Scanner Deployment Script

echo "🚀 Starting BLE Scanner deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version must be 20 or higher. Current version: $(node --version)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your database configuration before continuing."
    echo "Press Enter to continue after editing .env file..."
    read
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Run database migrations
echo "🗄️  Setting up database..."
npm run db:push

if [ $? -ne 0 ]; then
    echo "⚠️  Database setup failed. Please check your database configuration."
    exit 1
fi

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo "🏃 Starting application with PM2..."
    pm2 start ecosystem.config.js
    pm2 save
else
    echo "💡 PM2 not found. You can install it with: npm install -g pm2"
    echo "🏃 Starting application in production mode..."
    npm start &
fi

echo "✅ Deployment completed!"
echo "🌐 Application should be running at http://localhost:5000"
echo "🔍 Check the logs for any issues."

# Create logs directory if it doesn't exist
mkdir -p logs

echo "📋 Deployment Summary:"
echo "   - Application: BLE Scanner"
echo "   - URL: http://localhost:5000"
echo "   - Database: PostgreSQL"
echo "   - Process Manager: ${PM2_STATUS:-Direct}"
echo "   - Logs: ./logs/"
echo ""
echo "🛠️  Management Commands:"
echo "   - View logs: pm2 logs ble-scanner (if using PM2)"
echo "   - Stop: pm2 stop ble-scanner (if using PM2)"
echo "   - Restart: pm2 restart ble-scanner (if using PM2)"
echo "   - Status: pm2 status (if using PM2)"