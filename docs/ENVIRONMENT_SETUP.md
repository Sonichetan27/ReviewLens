# ReviewLens Environment Setup Guide

This guide explains how to configure ReviewLens for different environments (development, production) and troubleshoot common issues.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (for production) or local MongoDB (for development)
- Git

## Environment Variables

### Server Environment Variables (`server/.env`)

```bash
# Backend Server Configuration
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment: development, production
CLIENT_URL=http://localhost:5173  # Frontend URL for CORS

# Database Persistence
MONGODB_URI=mongodb+srv://...  # MongoDB Atlas connection string
MONGODB_DNS_SERVERS=          # Optional custom DNS servers

# AI Review Analysis (Gemini)
AI_MODE=mock                  # 'mock' (offline) or 'live' (Gemini API)
GEMINI_API_KEY=               # Google Gemini API key (for live mode)
GEMINI_MODEL=gemini-1.5-flash # Gemini model to use
```

### Client Environment Variables (`client/.env`)

```bash
# Frontend Client Configuration
VITE_API_URL=http://localhost:3000  # Backend API URL
VITE_USE_DUMMY=false                # Use mock data (true/false)
```

## Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd ReviewLens

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

#### Server Configuration (`server/.env`)

```bash
# Copy example file
cp .env.example .env

# Edit with your values
# - Set PORT (default: 3000)
# - Set MONGODB_URI (required for data persistence)
# - Set AI_MODE=mock for development (no API key needed)
```

#### Client Configuration (`client/.env`)

```bash
# Copy example file
cp .env.example .env

# Edit with your values
# - Set VITE_API_URL to match server PORT
# - Set VITE_USE_DUMMY=false to use live API
```

### 3. Start Development Servers

```bash
# Terminal 1: Start backend server
cd server
npm start

# Terminal 2: Start frontend development server
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173 (or next available port)
- Backend API: http://localhost:3000
- API Health Check: http://localhost:3000/api/health

## Production Setup

### 1. Database Configuration

For production, you need a MongoDB Atlas cluster:

1. Create a MongoDB Atlas account
2. Create a cluster
3. Create a database user with read/write permissions
4. Whitelist your application's IP addresses
5. Copy the connection string

### 2. Environment Configuration

#### Server Production Environment

```bash
# server/.env.production
PORT=3000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/...
AI_MODE=live                    # Use live Gemini API in production
GEMINI_API_KEY=your-api-key
GEMINI_MODEL=gemini-1.5-flash
```

#### Client Production Environment

```bash
# client/.env.production
VITE_API_URL=https://your-backend-domain.com
VITE_USE_DUMMY=false
```

### 3. Build and Deploy

```bash
# Build frontend for production
cd client
npm run build

# The build output will be in client/dist/
# Deploy this folder to your hosting service (Vercel, Netlify, etc.)

# Deploy backend to your hosting service (Render, Railway, Vercel, etc.)
# Ensure NODE_ENV=production is set
```

## Database Connection Issues

### Common MongoDB Connection Problems

#### 1. DNS Resolution Error
```
querySrv ECONNREFUSED _mongodb._tcp.cluster0.mongodb.net
```

**Solutions:**
- Check your internet connection
- Verify MongoDB Atlas cluster is running
- Try specifying custom DNS servers in `MONGODB_DNS_SERVERS`
- Check if your IP is whitelisted in MongoDB Atlas Network Access

#### 2. Authentication Error
```
Authentication failed
```

**Solutions:**
- Verify username and password in connection string
- Ensure database user has correct permissions
- Check if password contains special characters that need URL encoding

#### 3. Connection Timeout
```
Server selection timed out
```

**Solutions:**
- Check MongoDB Atlas cluster status
- Verify your IP is whitelisted
- Try increasing timeout in `server/config/db.js`

### Fallback Without Database

The application can run without a database connection for testing purposes:

1. Set `MONGODB_URI` to empty string or remove it from `.env`
2. Server will start but API endpoints will return 503 errors
3. Set `VITE_USE_DUMMY=true` in client to use mock data instead

## Port Configuration

### Default Ports
- Backend: 3000
- Frontend: 5173 (Vite default)

### Changing Ports

#### Change Backend Port
```bash
# In server/.env
PORT=5000
```

#### Change Frontend Port
```bash
# In client/.env
VITE_API_URL=http://localhost:5000

# Or when starting dev server
npm run dev -- --port 5174
```

### Port Conflicts

If you see "Port is in use" errors:

```bash
# Find process using the port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux

# Kill the process or use a different port
```

## AI Mode Configuration

### Mock Mode (Development)
```bash
# server/.env
AI_MODE=mock
```
- Uses deterministic heuristics for review analysis
- No API key required
- Fast, suitable for development and testing

### Live Mode (Production)
```bash
# server/.env
AI_MODE=live
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
```
- Uses Google Gemini API for real NLU
- Requires valid API key
- Slower but more accurate analysis

### Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file
4. Never commit API keys to version control

## Troubleshooting

### Frontend Cannot Connect to Backend

**Symptoms:** API calls fail with connection errors

**Solutions:**
1. Verify backend server is running: `curl http://localhost:3000/api/health`
2. Check `VITE_API_URL` in client `.env` matches backend port
3. Check CORS configuration in `server/server.js`
4. Check browser console for CORS errors

### Database Connection Fails

**Symptoms:** Server starts but API endpoints return 503 errors

**Solutions:**
1. Verify `MONGODB_URI` is correct in server `.env`
2. Check MongoDB Atlas cluster status
3. Verify your IP is whitelisted in MongoDB Atlas
4. Test connection string in MongoDB Atlas Connect dialog

### Build Errors

**Symptoms:** `npm run build` fails

**Solutions:**
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Check for TypeScript errors if using TS
3. Verify all environment variables are set
4. Check for syntax errors in source files

### Environment Variables Not Loading

**Symptoms:** `process.env` values are undefined

**Solutions:**
1. Ensure `.env` file exists in the correct directory
2. Check that `dotenv` is installed: `npm list dotenv`
3. Verify `.env` file is not in `.gitignore`
4. Restart the server after changing `.env`

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different API keys** for development and production
3. **Rotate API keys** regularly
4. **Use environment-specific configurations**
5. **Limit MongoDB Atlas IP whitelist** to only necessary IPs
6. **Enable MongoDB Atlas authentication** with strong passwords
7. **Use HTTPS** in production
8. **Set NODE_ENV=production** in production builds

## Validation Checklist

Before deploying to production:

- [ ] All environment variables are set correctly
- [ ] MongoDB connection is working
- [ ] Frontend connects to backend successfully
- [ ] All API endpoints return correct data
- [ ] AI mode is set to 'live' with valid API key
- [ ] CORS is configured for production domain
- [ ] Frontend build completes without errors
- [ ] No localhost URLs in production configuration
- [ ] Database backups are configured
- [ ] Error monitoring is set up
- [ ] Security headers are configured

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)