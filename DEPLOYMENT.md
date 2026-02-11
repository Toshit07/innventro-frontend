# Deployment Guide

## 🚀 Deploy Frontend to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel](https://vercel.com)** and sign in with your GitHub account

2. **Click "Add New Project"**

3. **Import your repository:**
   - Select `Toshit07/innventro-frontend`
   - Click "Import"

4. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Add Environment Variables:**
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   ```

6. **Click "Deploy"**

Your frontend will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

---

## 🖥️ Deploy Backend to Render

### Step-by-Step:

1. **Go to [Render](https://render.com)** and sign in with your GitHub account

2. **Click "New +" → "Web Service"**

3. **Connect your repository:**
   - Select `Toshit07/innventro-frontend`
   - Click "Connect"

4. **Configure Service:**
   - **Name:** `innoventure-backend` (or your preferred name)
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or choose paid plan)

5. **Add Environment Variables:**
   
   Click "Advanced" → "Add Environment Variable" and add:
   
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://kunalgavit285_db_user:Uqy6a2ozkUzcHjzK@cluster0.flvrq6q.mongodb.net/?appName=Cluster0
   JWT_SECRET=3KfNYFE6lOsYeNQM2tfZ48z1RNGPLfIHjB_wITVoR8X82Nbmt0z3JANQvgl014rM
   JWT_EXPIRE=7d
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ADMIN_EMAIL=admin@innoventure.com
   ADMIN_PASSWORD=admin123
   FRONTEND_URL=https://your-project.vercel.app
   ```

6. **Click "Create Web Service"**

Your backend will be live at `https://your-service.onrender.com`

---

## 🔗 Connect Frontend and Backend

### After Both Are Deployed:

1. **Update Vercel Environment Variables:**
   - Go to your Vercel project → Settings → Environment Variables
   - Update `VITE_API_URL` with your Render backend URL
   - Redeploy: Deployments → Click ⋯ → Redeploy

2. **Update Render Environment Variables:**
   - Go to your Render service → Environment
   - Update `FRONTEND_URL` with your Vercel frontend URL
   - Save Changes (will auto-redeploy)

---

## ✅ Verify Deployment

### Frontend (Vercel):
- Visit your Vercel URL
- Check if the site loads correctly
- Test navigation between pages

### Backend (Render):
- Visit `https://your-backend.onrender.com/api/products`
- Should return JSON data (or appropriate response)

### Integration:
- Try signing up/logging in on the frontend
- Add items to cart
- Check if all API calls work

---

## 🛠️ Troubleshooting

### Vercel Issues:
- **Build fails:** Check build logs in Vercel dashboard
- **Blank page:** Check browser console for errors, verify API URL
- **Environment variables not working:** Make sure they start with `VITE_`

### Render Issues:
- **Service won't start:** Check logs in Render dashboard
- **CORS errors:** Verify `FRONTEND_URL` is set correctly
- **Database connection fails:** Check MongoDB URI and network access settings

### Common Issues:
- **CORS errors:** Ensure backend `FRONTEND_URL` matches your Vercel domain
- **API calls fail:** Check that frontend `VITE_API_URL` points to Render backend
- **First load is slow:** Render free tier has cold starts (30-60 seconds)

---

## 📝 Notes

- **Free Tier Limitations:**
  - Render free tier spins down after inactivity
  - First request after inactivity takes 30-60 seconds
  - Consider upgrading for production use

- **Database:**
  - Ensure MongoDB Atlas network access allows connections from anywhere (0.0.0.0/0)
  - Or add Render's IP addresses to allowlist

- **Security:**
  - Change default admin password before production
  - Use strong JWT_SECRET in production
  - Don't commit `.env` files with real credentials

---

## 🎉 Done!

Your full-stack application is now deployed:
- ✅ Frontend on Vercel
- ✅ Backend on Render
- ✅ Database on MongoDB Atlas
