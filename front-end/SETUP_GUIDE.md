# Frontend Setup & Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Development Server](#running-the-development-server)
5. [Building for Production](#building-for-production)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, ensure you have the following installed:

- **Node.js**: v14 or higher
  - Download from: https://nodejs.org/
  - Verify installation: `node -v` and `npm -v`

- **Git**: For version control
  - Download from: https://git-scm.com/

- **Backend API Server**: Running and accessible
  - Default URL: `http://localhost:8080/api`
  - Ensure CORS is properly configured

---

## Installation

### Step 1: Navigate to Project Directory

```bash
cd /path/to/front-end
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`:
- React and React DOM
- Ant Design UI library
- Recharts for charting
- Axios for API calls
- React Router for navigation
- And more...

Wait for the installation to complete. It may take 2-5 minutes depending on your internet connection.

### Step 3: Verify Installation

```bash
npm list
```

This should show the installed packages without errors.

---

## Configuration

### Step 1: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit the `.env` file and update the following variables:

```env
# Development environment
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development

# For production, change to:
# REACT_APP_API_URL=https://your-production-api.com/api
# REACT_APP_ENV=production
```

**Important Variables:**

- `REACT_APP_API_URL`: Backend API base URL (must include `/api`)
- `REACT_APP_ENV`: Environment type (`development` or `production`)

### Step 3: Verify Backend Connection

Ensure your backend server is running:

```bash
# Test if backend is accessible
curl http://localhost:8080/api/purchase-orders
```

You should get a JSON response (even if empty).

---

## Running the Development Server

### Start the Development Server

```bash
npm start
```

This command will:
1. Start the development server (usually on `http://localhost:3000`)
2. Open the application in your default browser
3. Enable hot module reloading (changes are reflected immediately)

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the PO Management System dashboard.

### Stop the Server

Press `Ctrl + C` in your terminal to stop the development server.

---

## Building for Production

### Create a Production Build

```bash
npm run build
```

This will:
1. Compile React code to optimized JavaScript bundles
2. Minimize CSS and JavaScript files
3. Create a `build/` directory with production-ready files

The build process may take 1-2 minutes. Once complete, you should see:

```
The build folder is ready to be deployed.
```

### Verify the Build

```bash
npm test
```

Run tests (if configured) to ensure everything works correctly.

---

## Deployment

### Option 1: Deploy to Netlify

#### Using Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to your Netlify account
netlify login

# Deploy
netlify deploy --prod --dir=build
```

#### Manual Deployment:

1. Go to https://netlify.com
2. Sign in or create an account
3. Click "New site from Git"
4. Connect your GitHub repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Deploy

### Option 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow the prompts to complete deployment.

### Option 3: Deploy to Traditional Host

```bash
# Create production build
npm run build

# Upload the entire 'build' folder to your web server
# (e.g., via FTP, SCP, or hosting control panel)
```

**Important**: Make sure to update the `REACT_APP_API_URL` in your `.env` file before building for production to point to your production API server.

### Option 4: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
# Build Docker image
docker build -t po-management-frontend:1.0 .

# Run container
docker run -p 3000:3000 \
  -e REACT_APP_API_URL=http://your-api:8080/api \
  po-management-frontend:1.0
```

---

## Troubleshooting

### Issue: Dependencies Won't Install

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

### Issue: "react-scripts: command not found"

**Solution:**

```bash
npm install react-scripts --save-dev
```

### Issue: Port 3000 Already in Use

**Solution:**

```bash
# Use a different port
PORT=3001 npm start

# Or kill the process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Backend Connection Error (CORS)

**Solution:**

1. Verify backend is running: `curl http://localhost:8080/api/purchase-orders`
2. Check `.env` file for correct API URL
3. Enable CORS in backend:
   - In backend application properties or configuration
   - Allowed Origins should include your frontend URL

### Issue: Blank Page or 404 in Browser

**Solution:**

1. Check browser console for errors (F12 → Console)
2. Verify backend API is running
3. Check `.env` file configuration
4. Clear browser cache: `Ctrl + Shift + Delete` (Chrome)

### Issue: "Cannot find module" Error

**Solution:**

```bash
# Reinstall dependencies
npm install

# Clear node_modules cache
rm -rf node_modules/.cache
```

### Issue: Changes Not Reflected in Development

**Solution:**

1. Save the file (file should have been auto-saved)
2. Check browser console for errors
3. Clear browser cache and hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
4. Restart development server

---

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Create optimized build
npm run build
```

### Runtime Optimization

1. Use React.memo for components
2. Implement Code Splitting
3. Lazy load routes
4. Optimize images
5. Use production builds in production

---

## Environment-Specific Configuration

### Development Environment

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development
```

### Staging Environment

```env
REACT_APP_API_URL=https://staging-api.example.com/api
REACT_APP_ENV=staging
```

### Production Environment

```env
REACT_APP_API_URL=https://api.example.com/api
REACT_APP_ENV=production
```

---

## Git Workflow

### Initial Setup

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: React frontend setup"

# Add remote repository
git remote add origin https://github.com/yourusername/po-management-frontend.git

# Push to GitHub
git push -u origin main
```

### Daily Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push
```

---

## Support & Resources

### Official Documentation
- React: https://react.dev/
- Ant Design: https://ant.design/
- Recharts: https://recharts.org/
- React Router: https://reactrouter.com/

### Common Issues
- Check the API Documentation: `../docs/api_docs.md`
- Review backend logs for API errors
- Check browser console for frontend errors

### Getting Help
1. Check browser console for error messages (F12 → Console)
2. Check network tab for API calls (F12 → Network)
3. Verify all prerequisites are installed
4. Review the README.md file

---

## Next Steps

After successful setup:

1. **Customize the theme**: Edit color schemes in components
2. **Add authentication**: Implement login page and JWT token handling
3. **Enhance features**: Add more pages, charts, or functionality
4. **Improve performance**: Implement caching, pagination optimization
5. **Deploy**: Follow the deployment section above

---

**Last Updated**: April 2024
**Version**: 1.0.0
