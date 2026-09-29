# ReviewLens Deployment Guide

This guide covers deployment options for ReviewLens to various platforms.

## Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - Recommended

#### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository: `Sonichetan27/ReviewLens`

2. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables**
   Add these in Vercel Project Settings → Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_USE_DUMMY=false
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on git push

#### Backend Deployment (Render)

1. **Create Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Runtime**: Node 18

3. **Environment Variables**
   Add these in Render Environment Variables:
   ```
   PORT=3000
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/...
   MONGODB_DNS_SERVERS=
   AI_MODE=live
   GEMINI_API_KEY=your-gemini-api-key
   GEMINI_MODEL=gemini-1.5-flash
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will deploy automatically

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend Deployment (Netlify)

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - "Add new site" → "Import an existing project"
   - Connect GitHub repository

2. **Build Settings**
   - **Build command**: `cd client && npm run build`
   - **Publish directory**: `client/dist`

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_USE_DUMMY=false
   ```

#### Backend Deployment (Railway)

1. **Create Project**
   - Go to [Railway Dashboard](https://railway.app)
   - "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**
   - **Root Directory**: `server`
   - **Start Command**: `node server.js`

3. **Environment Variables**
   Same as Render configuration above

### Option 3: Docker Deployment

#### Build Docker Image

```bash
# Build the image
docker build -t reviewlens-backend .

# Run the container
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb+srv://... \
  -e AI_MODE=live \
  -e GEMINI_API_KEY=your-key \
  reviewlens-backend
```

#### Deploy to Docker Hub

```bash
# Tag the image
docker tag reviewlens-backend yourusername/reviewlens-backend:latest

# Push to Docker Hub
docker push yourusername/reviewlens-backend:latest
```

### Option 4: Vercel Serverless (Full Stack)

For serverless deployment, you can deploy both frontend and backend to Vercel:

1. **Create Vercel API Routes**
   - Move Express routes to Vercel serverless functions
   - Create `api/` directory structure

2. **Environment Variables**
   - Set all environment variables in Vercel

## Pre-Deployment Checklist

### Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user with read/write permissions
- [ ] IP whitelist configured (0.0.0.0/0 for cloud deployment)
- [ ] Connection string tested

### Environment Variables
- [ ] `MONGODB_URI` set with working connection string
- [ ] `GEMINI_API_KEY` configured (if using live AI mode)
- [ ] `CLIENT_URL` set to deployed frontend URL
- [ ] `NODE_ENV=production` set
- [ ] `AI_MODE=live` set for production

### Frontend Configuration
- [ ] `VITE_API_URL` set to deployed backend URL
- [ ] `VITE_USE_DUMMY=false` set
- [ ] Build runs successfully: `cd client && npm run build`

### Backend Configuration
- [ ] Server starts without errors
- [ ] All dependencies installed
- [ ] Database connection tested
- [ ] API endpoints respond correctly

### Security
- [ ] No secrets in git repository
- [ ] `.env` files in `.gitignore`
- [ ] CORS configured for production domain
- [ ] MongoDB Atlas network access restricted

## Database Seeding

After deployment, seed the database:

```bash
# SSH into your server or use Render/Railway console
cd server
npm run seed
```

## Monitoring & Logs

### Vercel
- Dashboard → Your Project → Logs
- View build logs and function logs

### Render
- Dashboard → Your Service → Logs
- View server logs and error logs

### Railway
- Dashboard → Your Service → Logs
- View real-time logs

## Troubleshooting

### Frontend Build Errors
```bash
# Clear cache and rebuild
cd client
rm -rf node_modules dist
npm install
npm run build
```

### Backend Connection Issues
- Check MongoDB Atlas cluster status
- Verify IP whitelist includes deployment platform IPs
- Test connection string locally first

### CORS Errors
- Ensure `CLIENT_URL` matches deployed frontend URL exactly
- Check CORS configuration in `server/server.js`

### Environment Variables Not Loading
- Verify variable names match exactly
- Restart deployment after adding variables
- Check platform-specific variable requirements

## Cost Estimates

### Vercel (Hobby Tier)
- Free for personal projects
- 100GB bandwidth/month
- Unlimited deployments

### Render (Free Tier)
- Free web service (spins down after inactivity)
- 512MB RAM
- 0.1 CPU

### MongoDB Atlas (Free Tier)
- 512MB storage
- Shared RAM
- Suitable for development/small projects

### Paid Tiers (Recommended for Production)
- Render: ~$7/month for basic web service
- MongoDB Atlas: ~$9/month for shared cluster
- Total: ~$16/month for production deployment

## Continuous Deployment

### Automatic Deployments
Both Vercel and Render support automatic deployments on git push:

1. Connect repository to platform
2. Configure build settings
3. Push to main branch triggers automatic deployment

### Manual Deployments
For more control, use manual deployment triggers:
- Vercel: Dashboard → Deployments → Redeploy
- Render: Dashboard → Manual Deploy

## Post-Deployment Steps

1. **Test All Endpoints**
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   curl https://your-backend-url.onrender.com/api/places
   ```

2. **Test Frontend**
   - Open deployed frontend URL
   - Test all pages and functionality
   - Check browser console for errors

3. **Monitor Performance**
   - Set up monitoring (Render Analytics, Vercel Analytics)
   - Check response times
   - Monitor error rates

4. **Set Up Backups**
   - Configure MongoDB Atlas automated backups
   - Regular snapshot backups

## Rollback Procedure

If issues occur after deployment:

### Vercel
- Dashboard → Deployments → Select previous deployment → "Redeploy"

### Render
- Dashboard → Deployments → Select previous deployment → "Rollback"

### Database
- MongoDB Atlas → Backup → Restore from snapshot

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)