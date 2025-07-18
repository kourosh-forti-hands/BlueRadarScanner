# BLE Scanner Application

A web-based Bluetooth Low Energy (BLE) scanner that detects devices with the specific OUI prefix 00:25:DF using Web Bluetooth API, with PostgreSQL database integration for device persistence.

## Features

- **BLE Device Scanning**: Detects nearby BLE devices using Web Bluetooth API
- **Target Device Filtering**: Focuses on devices with MAC addresses starting with 00:25:DF
- **Audio Notifications**: Configurable sound alerts when target devices are found
- **Device Persistence**: Stores discovered devices in PostgreSQL database
- **Real-time Updates**: Live scanning with device information display
- **Demo Mode**: Fallback simulation when Web Bluetooth API is not available
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js 20+ 
- PostgreSQL database
- Modern web browser (Chrome 56+, Edge 79+, or Opera 43+ for full Web Bluetooth support)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ble-scanner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your database configuration:
```
DATABASE_URL=postgresql://username:password@localhost:5432/ble_scanner
PGHOST=localhost
PGPORT=5432
PGDATABASE=ble_scanner
PGUSER=username
PGPASSWORD=password
```

4. Set up the database:
```bash
npm run db:push
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Production Deployment

### Build for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Local Hosting Setup

For local hosting, you can use the built-in production server:

1. **Install PM2** (process manager):
```bash
npm install -g pm2
```

2. **Create ecosystem file** for PM2:
```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'ble-scanner',
    script: 'dist/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
EOF
```

3. **Start with PM2**:
```bash
npm run build
pm2 start ecosystem.config.js
```

4. **Set up PM2 to start on boot**:
```bash
pm2 startup
pm2 save
```

### Alternative: Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t ble-scanner .
docker run -p 5000:5000 -e DATABASE_URL=your_db_url ble-scanner
```

## Database Setup

### PostgreSQL Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### Database Configuration

1. Create database and user:
```sql
sudo -u postgres psql
CREATE DATABASE ble_scanner;
CREATE USER ble_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ble_scanner TO ble_user;
\q
```

2. Update your `.env` file with the database connection details.

## Browser Compatibility

### Supported Browsers (Full Features)
- Chrome 56+
- Edge 79+
- Opera 43+

### Supported Browsers (Demo Mode)
- Firefox (demo mode only)
- Safari (demo mode only)
- Mobile browsers (demo mode only)

## API Endpoints

- `GET /api/ble-devices` - Get all devices
- `GET /api/ble-devices/target` - Get target devices (00:25:DF prefix)
- `POST /api/ble-devices` - Create/update device
- `GET /api/ble-devices/:id` - Get device by ID
- `PUT /api/ble-devices/:id` - Update device
- `DELETE /api/ble-devices/:id` - Delete device

## Project Structure

```
ble-scanner/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities
├── server/                 # Backend Express application
│   ├── db.ts              # Database connection
│   ├── storage.ts         # Data access layer
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── shared/                 # Shared TypeScript types
│   └── schema.ts          # Database schema
└── dist/                   # Built application
```

## Security Notes

1. **HTTPS Required**: Web Bluetooth API requires HTTPS in production
2. **Database Security**: Use strong passwords and limit database access
3. **Environment Variables**: Never commit `.env` files to version control
4. **CORS**: Configure CORS settings for production domains

## Troubleshooting

### Web Bluetooth API Issues
- Ensure HTTPS is enabled in production
- Check browser compatibility
- Verify user gesture requirements (button click to start scan)

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists and user has proper permissions

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all environment variables are set

## License

MIT License - see LICENSE file for details