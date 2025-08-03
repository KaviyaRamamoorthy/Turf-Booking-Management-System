# Frontend Deployment Guide - Vercel

This guide will help you deploy your Turf Booking Management frontend to Vercel with support for both local development and production environments.

## 📋 Prerequisites

1. GitHub account
2. Vercel account (free)
3. Your backend deployed (optional for frontend-only deployment)

## 🚀 Quick Deployment Steps

### Step 1: Create Environment Files

Create these environment files in the `turf-ui` directory:

#### `.env.local` (for local development)

```bash
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Turf Booking Management
VITE_ENVIRONMENT=development
```

#### `.env.production` (for production deployment)

```bash
VITE_API_URL=https://your-backend-url.herokuapp.com
VITE_APP_NAME=Turf Booking Management
VITE_ENVIRONMENT=production
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Deploy from the frontend directory:**

   ```bash
   cd turf-ui
   vercel
   ```

4. **Follow the prompts:**

   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - What's your project's name? `turf-booking-frontend`
   - In which directory is your code located? `./`

5. **Configure environment variables in Vercel dashboard:**
   - Go to your project dashboard on vercel.com
   - Navigate to Settings > Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.herokuapp.com`
   - Add: `VITE_APP_NAME` = `Turf Booking Management`
   - Add: `VITE_ENVIRONMENT` = `production`

#### Option B: Vercel Dashboard

1. **Connect GitHub Repository:**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `turf-ui` directory as the root

2. **Configure Build Settings:**

   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables:**
   - `VITE_API_URL` = `https://your-backend-url.herokuapp.com`
   - `VITE_APP_NAME` = `Turf Booking Management`
   - `VITE_ENVIRONMENT` = `production`

### Step 3: Update Backend URL

After your backend is deployed, update the `vercel.json` file:

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://YOUR-ACTUAL-BACKEND-URL.herokuapp.com/api/$1"
    }
  ]
}
```

### Step 4: Test Your Deployment

1. **Local Development:**

   ```bash
   cd turf-ui
   npm run dev
   # Should connect to http://localhost:8080
   ```

2. **Production:**
   - Visit your Vercel URL
   - Should connect to your live backend URL

## 🔧 Configuration Details

### API Configuration

- **Local:** Uses `http://localhost:8080/api` via Vite proxy
- **Production:** Uses environment variable `VITE_API_URL/api`

### Environment Variables

- `VITE_API_URL`: Your backend base URL (without /api)
- `VITE_APP_NAME`: Application name for branding
- `VITE_ENVIRONMENT`: Current environment (development/production)

### Build Process

- TypeScript compilation: `tsc -b`
- Vite build: `vite build`
- Output directory: `dist`

## 🔄 Redeployment

### Automatic Redeployment

- Push changes to your main branch
- Vercel automatically rebuilds and deploys

### Manual Redeployment

```bash
cd turf-ui
vercel --prod
```

## 🐛 Troubleshooting

### Common Issues:

1. **API calls failing:**

   - Check `VITE_API_URL` environment variable
   - Verify backend CORS configuration
   - Check network tab in browser dev tools

2. **Build failures:**

   - Run `npm run build` locally first
   - Check TypeScript errors
   - Verify all dependencies are in package.json

3. **Routing issues:**
   - Verify `vercel.json` configuration
   - Check that `"src": "/(.*)", "dest": "/index.html"` is present

### Debug Commands:

```bash
# Test build locally
npm run build

# Preview production build locally
npm run preview

# Check environment variables
echo $VITE_API_URL
```

## 📱 URL Structure

- **Local Development:** `http://localhost:3000`
- **Vercel Production:** `https://your-project-name.vercel.app`
- **Custom Domain:** Configure in Vercel dashboard

## 🔒 Security Notes

- Environment variables starting with `VITE_` are exposed to the client
- Never put sensitive data in `VITE_` variables
- Backend authentication tokens are handled securely via localStorage

Your frontend is now configured to work seamlessly with both local development and production environments!
