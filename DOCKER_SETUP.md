# Docker Setup for BLE Scanner on macOS

## Overview
This setup runs the BLE Scanner application in Docker containers with Bluetooth support on macOS.

## Prerequisites
- Docker Desktop for Mac (latest version)
- macOS with Bluetooth enabled
- Chrome or Edge browser (for Web Bluetooth API)

## Quick Start

### Option 1: One-Command Setup
```bash
chmod +x docker-run-mac.sh
./docker-run-mac.sh
```

### If Build Fails (ARM64 Issues)
```bash
# Option 1: Try the build fix
chmod +x build-fix.sh
./build-fix.sh

# Option 2: Use runtime build (most reliable)
chmod +x docker-run-simple.sh
./docker-run-simple.sh
```

### Option 2: Manual Setup
```bash
# Build and start services
docker-compose -f docker-compose.mac.yml up -d --build

# Check status
docker-compose -f docker-compose.mac.yml ps

# View logs
docker-compose -f docker-compose.mac.yml logs -f
```

## Bluetooth Configuration

### How It Works
1. **Web Bluetooth API**: The application uses the Web Bluetooth API through your browser
2. **Browser Access**: Your Mac's Bluetooth is accessed through the browser, not the container
3. **HTTPS Required**: Web Bluetooth requires HTTPS in production

### macOS Bluetooth Permissions
1. Open **System Preferences** > **Security & Privacy** > **Privacy**
2. Select **Bluetooth** from the left sidebar
3. Ensure **Google Chrome** or **Microsoft Edge** has permission
4. Enable Bluetooth on your MacBook Pro

## Container Architecture

### Services
- **app**: BLE Scanner application (Node.js + React)
- **db**: PostgreSQL database

### Container Features
- Bluetooth system libraries (bluez, dbus)
- Privileged mode for hardware access
- Network host mode for optimal connectivity
- Persistent database storage

## Testing Bluetooth

### 1. Check Container Bluetooth
```bash
# Check if Bluetooth is detected in container
docker-compose -f docker-compose.mac.yml exec app hciconfig

# Check D-Bus
docker-compose -f docker-compose.mac.yml exec app dbus-daemon --version
```

### 2. Test Web Application
1. Open Chrome/Edge
2. Navigate to `http://localhost:5000`
3. Click "Start Scanning"
4. Grant Bluetooth permissions when prompted
5. Look for devices with MAC addresses starting with "00:25:DF"

### 3. Demo Mode
If real Bluetooth isn't working, the app provides demo mode with simulated devices.

## Management Commands

### Container Management
```bash
# View running containers
docker-compose -f docker-compose.mac.yml ps

# Stop services
docker-compose -f docker-compose.mac.yml down

# Restart services
docker-compose -f docker-compose.mac.yml restart

# View logs
docker-compose -f docker-compose.mac.yml logs -f app
docker-compose -f docker-compose.mac.yml logs -f db

# Shell into container
docker-compose -f docker-compose.mac.yml exec app sh
```

### Database Management
```bash
# Connect to database
docker-compose -f docker-compose.mac.yml exec db psql -U ble_user -d ble_scanner

# Backup database
docker-compose -f docker-compose.mac.yml exec db pg_dump -U ble_user ble_scanner > backup.sql

# Restore database
docker-compose -f docker-compose.mac.yml exec -T db psql -U ble_user -d ble_scanner < backup.sql
```

## Troubleshooting

### Common Issues

#### 1. Bluetooth Not Working
- **Check Browser**: Use Chrome 56+ or Edge 79+
- **Check Permissions**: Ensure browser has Bluetooth permissions
- **Check HTTPS**: Web Bluetooth requires HTTPS (or localhost)
- **Try Demo Mode**: Use built-in demo for testing

#### 2. Container Won't Start
```bash
# Check logs
docker-compose -f docker-compose.mac.yml logs

# Rebuild containers
docker-compose -f docker-compose.mac.yml up -d --build --force-recreate
```

#### 3. Database Connection Issues
```bash
# Check database logs
docker-compose -f docker-compose.mac.yml logs db

# Reset database
docker-compose -f docker-compose.mac.yml down -v
docker-compose -f docker-compose.mac.yml up -d
```

#### 4. Port Conflicts
```bash
# Check what's using port 5000
lsof -i :5000

# Use different port
docker-compose -f docker-compose.mac.yml up -d --scale app=0
docker run -p 5001:5000 [image_name]
```

## Security Considerations

### Docker Security
- Containers run in privileged mode for Bluetooth access
- Network host mode for optimal connectivity
- Database credentials in environment variables

### Bluetooth Security
- Web Bluetooth API provides secure pairing
- User consent required for device access
- HTTPS encryption for data transmission

## Performance Optimization

### Container Resources
```bash
# Monitor resource usage
docker stats

# Limit memory usage
docker-compose -f docker-compose.mac.yml up -d --memory=512m
```

### Database Optimization
```bash
# Check database size
docker-compose -f docker-compose.mac.yml exec db du -sh /var/lib/postgresql/data

# Optimize database
docker-compose -f docker-compose.mac.yml exec db psql -U ble_user -d ble_scanner -c "VACUUM ANALYZE;"
```

## Development Setup

### Local Development with Docker
```bash
# Development with hot reload
docker-compose -f docker-compose.mac.yml -f docker-compose.dev.yml up -d

# Watch logs
docker-compose -f docker-compose.mac.yml logs -f app
```

### Environment Variables
```bash
# Override environment variables
export DATABASE_URL=postgresql://custom_user:custom_pass@localhost:5432/custom_db
docker-compose -f docker-compose.mac.yml up -d
```

## Backup and Recovery

### Full Backup
```bash
# Create backup directory
mkdir -p backups/$(date +%Y%m%d)

# Backup database
docker-compose -f docker-compose.mac.yml exec db pg_dump -U ble_user ble_scanner > backups/$(date +%Y%m%d)/database.sql

# Backup logs
cp -r logs/ backups/$(date +%Y%m%d)/
```

### Recovery
```bash
# Restore database
docker-compose -f docker-compose.mac.yml exec -T db psql -U ble_user -d ble_scanner < backups/20240118/database.sql

# Restore logs
cp -r backups/20240118/logs/ ./
```