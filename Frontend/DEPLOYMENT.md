# Deployment Guide

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running and accessible

## Environment Setup

### Development
```bash
cp .env .env.local
# Update VITE_API_BASE_URL to your backend URL
```

### Production
```bash
cp .env.production .env.production.local
# Update VITE_API_BASE_URL to your production backend URL
```

## Build Commands

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm install
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Deployment Options

### 1. Static Hosting (Netlify, Vercel, etc.)
1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting service
3. Configure environment variables in your hosting dashboard

### 2. Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### 3. Server Deployment
1. Build: `npm run build`
2. Serve the `dist` folder with any web server (nginx, apache, etc.)

## Environment Variables
- `VITE_API_BASE_URL`: Backend API base URL

## Important Notes
- Update the backend URL in production environment
- Ensure CORS is configured on your backend for the frontend domain
- All console.log statements have been removed for production
- The app uses React Router, ensure your server supports SPA routing

## Features Included
✅ User Authentication
✅ Video Upload & Management  
✅ Playlist Management
✅ Search Functionality
✅ Comments System
✅ Tweet/Social Features
✅ Channel Management
✅ Responsive Design
✅ Production Ready