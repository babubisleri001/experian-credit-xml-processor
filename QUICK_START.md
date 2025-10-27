# Quick Start: Deploy to Render in 5 Minutes

## Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Create MongoDB Atlas Database (if needed)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (takes ~3 minutes)
3. Click "Connect" → Get connection string
4. Replace `<password>` with your actual password

## Step 3: Deploy on Render
1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: experian-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## Step 4: Add Environment Variables
In Render → Environment tab → Add these:

```
NODE_ENV = production
MONGODB_URI = your_mongodb_connection_string
FRONTEND_URL = https://your-frontend.onrender.com
```

Click "Create Web Service"

## Step 5: Verify Deployment
Once deployed, test: `https://your-backend.onrender.com/health`

Done! Your backend is now live.

## Common Issues

**"Cannot find module" error?**
→ Set Root Directory to `backend` in Render settings

**MongoDB connection failed?**
→ Add `0.0.0.0/0` to MongoDB Atlas IP whitelist

**CORS errors?**
→ Check that FRONTEND_URL has no trailing slash

For detailed instructions, see `RENDER_DEPLOYMENT.md`

