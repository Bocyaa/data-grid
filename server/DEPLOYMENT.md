# Deployment Guide: Railway

## 🚀 Quick Deploy to Railway

### 1. Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))

### 2. Repository Setup

```bash
# Make sure your code is committed
git add .
git commit -m "feat: prepare for deployment"
git push origin main
```

### 3. Deploy Steps

1. **Go to [railway.app](https://railway.app)** and sign in with GitHub
2. **Click "New Project"** → **"Deploy from GitHub repo"**
3. **Select your `data-grid` repository**
4. **Railway will auto-detect the server** in the `/server` directory

### 4. Environment Variables

In Railway dashboard, go to your project → **Variables** tab and add:

```
PORT=5174
NODE_ENV=production
CORS_ORIGIN=*
DATABASE_URL=mysql://your_db_connection_string
```

### 5. Database Setup

**Option A: Railway MySQL (Recommended)**

1. In Railway dashboard, click **"+ New"** → **"Database"** → **"MySQL"**
2. Copy the connection string from the database **Variables** tab
3. Paste it as `DATABASE_URL` in your app variables

**Option B: Use Existing Aiven DB**

- Use your current `DATABASE_URL` from `.env`

### 6. Deploy Settings

Railway should auto-detect, but verify:

- **Build Command**: `npm run deploy`
- **Start Command**: `npm start`
- **Root Directory**: `/server`

### 7. Custom Domain (Optional)

- Go to **Settings** → **Domains**
- Add custom domain or use Railway's generated URL

## 🔧 Alternative: Render.com

If Railway doesn't work, try **Render**:

1. Go to [render.com](https://render.com)
2. **New** → **Web Service**
3. Connect GitHub repo
4. Settings:
   - **Environment**: `Node`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm run deploy`
   - **Start Command**: `npm start`

## 🌐 Other Free Options

### Heroku (Limited Free)

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set buildpack for subdirectory
heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack
heroku config:set PROJECT_PATH=server

# Deploy
git push heroku main
```

### Vercel (Functions)

- Good for serverless, but requires refactoring to Vercel Functions

## 📝 Post-Deployment

1. **Test your API**: `https://your-app.railway.app/health`
2. **Update client**: Change API URL in client `.env`
3. **Test uploads**: Verify CSV upload functionality
4. **Monitor logs**: Check Railway dashboard for any issues

## 🔒 Security Notes

- **CORS**: Set to specific domain in production
- **Environment**: Never commit `.env` files
- **Database**: Use connection pooling for production
- **Rate Limiting**: Consider adding for public APIs

## 🐛 Troubleshooting

**Build Fails?**

- Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation with `npm run build`

**Database Connection Issues?**

- Verify `DATABASE_URL` format
- Check if database allows external connections
- Run `npx prisma migrate deploy` manually if needed

**CORS Errors?**

- Update `CORS_ORIGIN` to your frontend URL
- Check if credentials are needed
