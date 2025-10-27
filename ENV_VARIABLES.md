# Environment Variables for Backend

The following environment variables need to be configured in your Render dashboard:

## Required Variables

### PORT
- **Default**: `5000`
- **Description**: Server port (automatically set by Render)
- **Note**: Render sets this automatically, don't override

### NODE_ENV
- **Required**: Yes
- **Description**: Set to `production` for production deployment
- **Value**: `production`

### MONGODB_URI
- **Required**: Yes
- **Description**: MongoDB connection string
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- **Note**: Get this from MongoDB Atlas or your MongoDB provider

### FRONTEND_URL
- **Required**: Yes
- **Description**: Frontend URL for CORS configuration
- **Example**: `https://your-frontend.onrender.com`
- **Note**: This should be your deployed frontend URL (no trailing slash)

## Optional Variables

### MAX_FILE_SIZE
- **Default**: `5242880` (5MB)
- **Description**: Maximum file upload size in bytes
- **Note**: Can be left at default unless you need to change it

## Setting Up in Render

1. Go to your Render dashboard
2. Select your backend service
3. Navigate to "Environment" tab
4. Add each variable by clicking "Add Environment Variable"
5. Save changes

## MongoDB Setup

If you don't have a MongoDB database yet:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `<password>` with your actual password
5. Replace `<database>` with your desired database name
6. Add the complete URI to Render's environment variables

