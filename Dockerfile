FROM node:20-alpine

WORKDIR /app

# Install system dependencies for Bluetooth
RUN apk add --no-cache \
    bluez \
    bluez-dev \
    dbus \
    curl \
    python3 \
    make \
    g++

# Copy package files
COPY package*.json ./

# Install dependencies with npm cache clean to avoid ARM64 issues
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install --no-optional --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create logs directory
RUN mkdir -p logs

# Create dbus directory
RUN mkdir -p /var/run/dbus

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start dbus and the application
CMD ["sh", "-c", "dbus-daemon --system --fork && npm start"]