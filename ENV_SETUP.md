# Quick Setup Guide — Environment Variables

## Render Backend Setup

1. Go to https://dashboard.render.com
2. Select your Valkyrie Backend service
3. Click **Environment** (or **Settings → Environment**)
4. Add these environment variables:

```
PORT                5000
MONGODB_URI         mongodb+srv://deepamanyam666_db_user:me6uYu0mm2GHQztM@cluster0.xejrawe.mongodb.net/valkyrie?retryWrites=true&w=majority
JWT_SECRET          valkyrie_super_secret_key_2025_do_not_share
JWT_EXPIRES_IN      7d
NODE_ENV            production
FRONTEND_URL        https://valkyrie-network-1-n2abp1km-deepas-projects-274b5319.vercel.app
```

**IMPORTANT**: 
- Replace the `FRONTEND_URL` with your actual Vercel deployment URL
- If you have multiple Vercel domains (preview + prod), use comma-separated:
  ```
  FRONTEND_URL=https://preview.vercel.app,https://prod.vercel.app
  ```
- After saving, **redeploy** the service

---

## Vercel Frontend Setup

1. Go to https://vercel.com/dashboard
2. Select your Valkyrie Network project
3. Go to **Settings → Environment Variables**
4. Add this variable:

```
Name:  NEXT_PUBLIC_API_URL
Value: https://valkyrie-network-nw22.onrender.com/api
Environments: Production, Preview, Development
```

**CRITICAL**: 
- Include `/api` in the value (exactly as shown)
- This makes API calls resolve to `/api/auth/signup` not just `/auth/signup`

5. After saving, **redeploy** the project

---

## Verification After Setup

### Backend (Render)
1. Go to Render Logs
2. Look for: `✅ Environment variables loaded`
3. Look for: `✅ MongoDB connected successfully`
4. Look for: `🚀 Valkyrie Backend running on port 5000`

### Frontend (Vercel)
1. Go to Vercel Deployments
2. Check build logs (no errors)
3. Open your frontend URL
4. Open DevTools → Network tab
5. Try signup/login
6. Check that requests go to `https://valkyrie-network-nw22.onrender.com/api/...` ✓

---

## Common Issues & Fixes

### CORS Error in Console
**Symptom**: `Access to XMLHttpRequest at 'https://...' from origin 'https://...' has been blocked by CORS policy`

**Fix**:
- Check that `FRONTEND_URL` on Render exactly matches your Vercel URL
- Redeploy backend after changing `FRONTEND_URL`
- Wait 2-3 minutes for Render to fully restart

### Login Success but Page Stays on Login
**Symptom**: Form submits, no errors, but page doesn't navigate to dashboard

**Fix**:
- Check DevTools → Network → API calls should show 200/201 responses
- Check LocalStorage has `auth-storage` key with token
- Verify `NEXT_PUBLIC_API_URL` on Vercel includes `/api` suffix
- Redeploy frontend

### 401 Unauthorized on Protected Routes
**Symptom**: Dashboard page shows error, network shows 401 responses

**Fix**:
- Log in again to get a fresh token
- Clear browser cache and localStorage
- Verify JWT_SECRET is the same on backend
- Check backend logs for auth errors

---

## Copy-Paste Values

Use these exact values (replace URLs with your actual deployment URLs):

**Render**:
```
FRONTEND_URL=https://valkyrie-network-1-n2abp1km-deepas-projects-274b5319.vercel.app
JWT_SECRET=valkyrie_super_secret_key_2025_do_not_share
MONGODB_URI=mongodb+srv://deepamanyam666_db_user:me6uYu0mm2GHQztM@cluster0.xejrawe.mongodb.net/valkyrie?retryWrites=true&w=majority
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=5000
```

**Vercel**:
```
NEXT_PUBLIC_API_URL=https://valkyrie-network-nw22.onrender.com/api
```

Done! Your deployment should now work end-to-end.
