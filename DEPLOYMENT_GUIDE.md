# Women Awareness MERN App - Deployment Guide

This guide will help you deploy your Women Awareness application to production using Netlify (frontend) and Render (backend).

## 🚀 Quick Start

### 1. MongoDB Atlas Setup (Database)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier available)

2. **Configure Database Access**
   - In Atlas Dashboard, go to Database Access
   - Create a new database user (username/password)
   - Grant "Read and write to any database" permissions

3. **Configure Network Access**
   - Go to Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for testing
   - For production, add specific IP addresses

4. **Get Connection String**
   - Go to Database > Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<cluster-url>` with your cluster URL

### 2. Environment Variables Setup

#### Backend (.env for local development)
Create a `.env` file in the `server/` directory:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/women-awareness?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
FRONTEND_URL=https://women-awareness-app.netlify.app
LOG_LEVEL=info
OPENAI_API_KEY=your_openai_api_key_here
```

#### Frontend (.env for local development)
Create a `.env` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Deploy Backend to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin master
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New Web Service"
   - Connect your GitHub repository
   - Use the `render.yaml` file for automatic configuration

3. **Set Environment Variables in Render**
   In your Render dashboard, go to your service settings and add:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A long, random secret key
   - `OPENAI_API_KEY`: Your OpenAI API key (optional, for AI features)
   - `FRONTEND_URL`: https://women-awareness-app.netlify.app

4. **Deploy**
   - Render will automatically deploy your backend
   - The service will be available at: `https://women-awareness-api.onrender.com`

### 4. Deploy Frontend to Netlify

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Update deployment configuration"
   git push origin master
   ```

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Choose your repository

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `client/dist`
   - Build directory: `client`

4. **Deploy**
   - Netlify will automatically build and deploy your frontend
   - The site will be available at: `https://women-awareness-app.netlify.app`

## 🔧 Configuration Details

### Netlify Configuration (`netlify.toml`)
- Frontend builds from `client/` directory
- API requests are proxied to Render backend
- React Router routes are handled correctly
- Node.js version 18 is used

### Render Configuration (`render.yaml`)
- Backend runs on Node.js environment
- Free tier plan (suitable for development/testing)
- Port 10000 is used for Render
- Environment variables are configured for production

### CORS Configuration
The backend is configured to allow requests from:
- `https://women-awareness-app.netlify.app`
- `http://localhost:3000` (development)
- `http://localhost:5173` (Vite development)

## 🌐 URLs

After deployment:
- **Frontend**: `https://women-awareness-app.netlify.app`
- **Backend API**: `https://women-awareness-api.onrender.com/api`
- **Admin Panel**: `https://women-awareness-app.netlify.app/admin`

## 🔒 Security Notes

1. **JWT Secret**: Use a long, random string (32+ characters)
2. **Database Security**: Restrict IP access in production
3. **Environment Variables**: Never commit `.env` files to Git
4. **OpenAI API Key**: Optional, only needed for AI features

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` environment variable
   - Verify CORS configuration in `server/config/cors.js`

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has proper permissions

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check build logs in Netlify/Render dashboards

### Getting Help

1. Check the deployment logs in Netlify and Render dashboards
2. Verify environment variables are correctly set
3. Test API endpoints using tools like Postman
4. Check browser developer console for frontend errors

## 📝 Next Steps

1. **Custom Domain**: Set up custom domains in Netlify and Render
2. **SSL/HTTPS**: Both platforms provide free SSL certificates
3. **Monitoring**: Set up monitoring and alerting
4. **Backup**: Configure database backups in MongoDB Atlas
5. **Scaling**: Upgrade plans as your application grows

## 🎯 Production Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Environment variables set in Render
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] API connectivity tested
- [ ] Admin panel accessible
- [ ] SSL certificates active
- [ ] Custom domains configured (optional)
- [ ] Monitoring set up (optional)

## 📞 Support

For issues with this deployment:
1. Check the troubleshooting section above
2. Review deployment logs in Netlify and Render
3. Verify all configuration files are correct
4. Test locally before deploying

Your Women Awareness application should now be live and accessible to users!