# Quick Start Guide - BLE Scanner

## 🚀 One-Command Deployment

For the fastest setup, run the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📋 Manual Setup (5 minutes)

### 1. Prerequisites
- Node.js 20+ ([Download](https://nodejs.org/))
- PostgreSQL ([Download](https://www.postgresql.org/download/))

### 2. Database Setup
```bash
# Create database
sudo -u postgres psql -c "CREATE DATABASE ble_scanner;"
sudo -u postgres psql -c "CREATE USER ble_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ble_scanner TO ble_user;"
```

### 3. Application Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Build application
npm run build

# Setup database schema
npm run db:push

# Start application
npm start
```

### 4. Access Application
Open browser to: http://localhost:5000

## 🐳 Docker Deployment

### Option 1: Docker Compose (Recommended)
```bash
# Start with database included
docker-compose up -d

# Access at http://localhost:5000
```

### Option 2: Docker Only
```bash
# Build image
docker build -t ble-scanner .

# Run with external database
docker run -p 5000:5000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  ble-scanner
```

## 🔧 Production Management

### PM2 Process Manager
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 status
pm2 logs ble-scanner

# Auto-start on boot
pm2 startup
pm2 save
```

### Basic Commands
```bash
# Check application health
curl http://localhost:5000/health

# View logs
tail -f logs/combined.log

# Stop application
pm2 stop ble-scanner
```

## 🌐 Browser Support

### Full Features (Web Bluetooth)
- Chrome 56+
- Edge 79+
- Opera 43+

### Demo Mode Only
- Firefox
- Safari
- Mobile browsers

## 🔒 Security Notes

1. **HTTPS Required**: Enable HTTPS for production deployment
2. **Database**: Use strong passwords and restrict access
3. **Environment**: Never commit `.env` files
4. **Firewall**: Configure firewall rules for port 5000

## 📞 Support

If you encounter issues:
1. Check logs in `./logs/` directory
2. Verify database connection
3. Ensure port 5000 is available
4. Check Node.js version (must be 20+)

## 🎯 Testing

After deployment, test the application:
1. Visit http://localhost:5000
2. Click "Start Demo" (if Web Bluetooth not supported)
3. Verify devices are detected and saved
4. Check database for stored devices