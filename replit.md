# BLE Scanner Application

## Overview

This is a full-stack web application built for scanning and monitoring Bluetooth Low Energy (BLE) devices, specifically targeting devices with MAC addresses starting with "00:25:DF". The application features a React frontend with TypeScript, an Express.js backend, and uses Drizzle ORM for database operations with PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with `/api` prefix

### Database Schema
The application uses two main tables:
- **Users**: Basic user authentication with username/password
- **BLE Devices**: Device information including MAC address, RSSI, device type, and target device classification

## Key Components

### Frontend Components
1. **BLE Scanner Page**: Main interface for device scanning and monitoring
2. **Device Card**: Individual device display with signal strength and device info
3. **Scan Controls**: Control panel for starting/stopping scans with audio notifications
4. **Signal Strength**: Visual RSSI indicator component
5. **UI Components**: Comprehensive set of reusable UI components from shadcn/ui

### Backend Components
1. **Storage Interface**: Abstraction layer for database operations
2. **Memory Storage**: In-memory fallback implementation for development
3. **Route Registration**: Centralized route management system
4. **Vite Integration**: Development server with HMR support

### Custom Hooks
- **useBluetoothScanner**: Manages BLE scanning operations with mock data
- **useAudioNotifications**: Handles audio feedback for device detection
- **useToast**: Toast notification system
- **useMobile**: Responsive design utilities

## Data Flow

1. **Client Initialization**: React app loads with TanStack Query for server state
2. **BLE Scanning**: Frontend simulates BLE scanning with mock device data
3. **Device Detection**: New devices trigger audio notifications and UI updates
4. **Data Storage**: Device information can be persisted via backend API
5. **Real-time Updates**: UI updates in real-time as devices are discovered

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- Radix UI primitives for accessible components
- TanStack Query for data fetching
- Tailwind CSS for styling
- Lucide React for icons

### Backend Dependencies
- Express.js for server framework
- Drizzle ORM for database operations
- Neon Database serverless driver
- PostgreSQL session store
- Zod for schema validation

### Development Dependencies
- TypeScript for type safety
- Vite for build tooling
- ESBuild for server bundling
- Replit-specific plugins for development environment

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with hot reload
- **Database**: PostgreSQL via Neon serverless

### Production Build
- **Frontend**: Static build output to `dist/public`
- **Backend**: Bundled with ESBuild to `dist/index.js`
- **Deployment**: Single Node.js process serving both frontend and API

### Environment Configuration
- Database URL configuration via environment variables
- Separate development and production modes
- Replit-specific development tooling integration

## Architecture Decisions

### Mock BLE Implementation
**Problem**: Web Bluetooth API has limited browser support and requires HTTPS
**Solution**: Mock implementation with realistic device data for development and testing
**Rationale**: Allows full application development without hardware dependencies

### Monorepo Structure
**Problem**: Managing frontend and backend code separately increases complexity
**Solution**: Unified project structure with shared TypeScript configuration
**Rationale**: Simplified development workflow and shared type definitions

### Memory Storage Fallback
**Problem**: Database might not be available during initial development
**Solution**: In-memory storage implementation matching database interface
**Rationale**: Enables development without database setup while maintaining consistent API

### Component-First UI Architecture
**Problem**: Maintaining consistent design system across application
**Solution**: shadcn/ui components with Radix UI primitives
**Rationale**: Provides accessible, customizable components with consistent styling