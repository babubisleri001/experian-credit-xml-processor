# Deploy Backend to Render

This guide will help you deploy your Express.js backend to Render.

## Prerequisites

1. A GitHub account with this repository
2. A MongoDB database (free tier available at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
3. A Render account (free tier available at [Render](https://render.com))

## Step 1: Set Up MongoDB (if not already done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/login and create a free cluster
3. Wait for the cluster to be created (takes a few minutes)
4. Click "Connect" → "Drivers" → Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `experian`)
7. Save this connection string for later

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/experian?retryWrites=true&w=majority
```

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended for Git-based deployment)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Select the repository: `experian-credit-xml-processor`
5. Render will automatically detect the `render.yaml` file
6. Click "Apply"

### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `experian-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (IMPORTANT!)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## Step 3: Configure Environment Variables

In your Render service dashboard:

1. Go to "Environment" tab
2. Add the following environment variables:

### Required Variables:

```
NODE_ENV = production
MONGODB_URI = your_mongodb_connection_string_here
FRONTEND_URL = https://your-frontend-url.onrender.com
```

### Optional Variables:

```
MAX_FILE_SIZE = 5242880
```

**Important Notes:**
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Replace `FRONTEND_URL` with your deployed frontend URL (no trailing slash)
- PORT is automatically set by Render, don't override it

## Step 4: Deploy and Verify

1. Click "Save Changes" in the Environment tab
2. Go to "Events" or "Logs" tab to watch the deployment
3. Wait for the build to complete (typically 2-5 minutes)
4. Once deployed, you'll get a URL like: `https://experian-backend-xxxx.onrender.com`
5. Test the health endpoint: `https://your-backend-url.onrender.com/health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Step 5: Update Frontend Configuration

1. Update your frontend `.env` file to point to the new backend URL:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. Redeploy your frontend if it's already on Render

## Troubleshooting

### Build fails with "Cannot find module"
- Ensure the **Root Directory** is set to `backend`
- Check that `package.json` exists in the `backend` directory

### MongoDB connection errors
- Verify your MongoDB connection string is correct
- Check that your MongoDB Atlas IP whitelist allows connections (set to `0.0.0.0/0` for Render)
- Ensure your MongoDB password doesn't contain special characters that need URL encoding

### CORS errors
- Verify `FRONTEND_URL` environment variable is set correctly in Render
- Make sure there's no trailing slash in the FRONTEND_URL
- Check that your frontend is making requests to the correct backend URL

### Service goes to sleep (Free Tier)
- On the free tier, Render puts services to sleep after 15 minutes of inactivity
- The first request after sleep may take 30-60 seconds to wake up the service
- Consider upgrading to prevent sleep, or use a service like [Uptime Robot](https://uptimerobot.com/) to ping your service

### Viewing Logs
- Go to Render dashboard → Your service → "Logs" tab
- This shows real-time logs and helps debug issues

## Testing Endpoints

Once deployed, test these endpoints:

```
# Health check
GET https://your-backend-url.onrender.com/health

# Upload XML file
POST https://your-backend-url.onrender.com/api/reports/upload
Content-Type: multipart/form-data
Body: file (XML file)

# Get all reports
GET https://your-backend-url.onrender.com/api/reports

# Get report by ID
GET https://your-backend-url.onrender.com/api/reports/:id

# Get report by PAN
GET https://your-backend-url.onrender.com/api/reports/search/pan/:pan

# Get report by phone
GET https://your-backend-url.onrender.com/api/reports/search/phone/:phone

# Get stats
GET https://your-backend-url.onrender.com/api/reports/stats/overview
```

## Cost Considerations

- **Free Tier**: Includes 750 hours/month (enough for 24/7 hosting)
- **Sleep Mode**: Services sleep after 15 minutes of inactivity (free tier)
- **Database**: MongoDB Atlas free tier (M0) is sufficient for development/testing
- **Auto-deploy**: Automatically deploys on git push to main branch

## Next Steps

After successful deployment:
1. Set up continuous deployment (already enabled)
2. Configure custom domain (optional)
3. Set up monitoring and alerts
4. Consider upgrading for better performance

## Support

For issues with:
- Render: Check [Render Docs](https://render.com/docs)
- MongoDB: Check [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- This project: Check GitHub Issues

