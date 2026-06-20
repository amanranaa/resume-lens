# 🔐 Google OAuth Setup Guide - ResumeLens

## ⚠️ Error: 400 invalid_request - Solution

The `Error 400: invalid_request` when signing up with Google means your OAuth credentials are not configured correctly.

Follow this step-by-step guide to fix it.

---

## 📋 Step 1: Create Google Cloud Project

### 1.1 Go to Google Cloud Console

- Visit: https://console.cloud.google.com/
- Click **"Select a Project"** at the top

### 1.2 Create New Project

- Click **"+ New Project"**
- Project name: `ResumeLens`
- Organization: Leave blank
- Click **"Create"**

### 1.3 Wait for Project Creation

- Wait 1-2 minutes for project to be created
- Google will show notification when done

---

## 🔧 Step 2: Enable OAuth 2.0

### 2.1 Go to Credentials

- In the left sidebar: **APIs & Services** → **Credentials**
- You may see "Create credentials" button

### 2.2 Configure OAuth Consent Screen (FIRST TIME ONLY)

If prompted "Create OAuth Client ID":

1. Click **"CONFIGURE CONSENT SCREEN"** or **"OAuth consent screen"**
2. Select **"External"** (for testing)
3. Click **"Create"**

### 2.3 Fill OAuth Consent Screen

**App Information Section:**

- App name: `ResumeLens`
- User support email: Your email address
- Save and continue

**Scopes Section:**

- Click **"Add or Remove Scopes"**
- Search for and select:
  - `openid`
  - `email`
  - `profile`
- Click **"Update"**
- Save and continue

**Test Users Section:**

- Click **"Add Users"**
- Add your email address
- Click **"Add"**
- Save and continue

**Review & Submit:**

- Click **"Back to Dashboard"**

---

## 🔑 Step 3: Create OAuth Client ID

### 3.1 Create Credentials

- Go back to **APIs & Services** → **Credentials**
- Click **"+ Create Credentials"**
- Select **"OAuth Client ID"**

### 3.2 Application Type

- Application type: **Web application**
- Name: `ResumeLens Web`

### 3.3 Authorized Redirect URIs

Add both local and production URLs:

**For Local Development:**

```
http://localhost:5000/auth/google/callback
```

**For Production (add later):**

```
https://yourdomain.com/auth/google/callback
```

Click **"Add URI"** for each one

### 3.4 Create

- Click **"Create"**
- A popup will show your credentials

---

## 📝 Step 4: Copy Credentials

You'll see a screen with:

- **Client ID** (looks like: `xxx.apps.googleusercontent.com`)
- **Client Secret** (looks like: `xxx-xxxxxxxxx`)

**IMPORTANT: Copy both values!**

---

## 🔗 Step 5: Add to .env File

### 5.1 Open .env in ResumeLens folder

Edit `ResumeLens\.env`:

```bash
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
```

**Example (.env file):**

```
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=dev-secret-key-for-testing-only-change-in-production

DATABASE_URL=sqlite:///resumelens.db

GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

SERVER_NAME=localhost:5000
PREFERRED_URL_SCHEME=http
```

⚠️ **DO NOT share these values! Add .env to .gitignore (already done)**

---

## ✅ Step 6: Test Locally

### 6.1 Stop Current App (if running)

Press `CTRL+C` in terminal

### 6.2 Restart Flask

```bash
cd ResumeLens
python app.py
```

### 6.3 Test Google OAuth

1. Visit: http://127.0.0.1:5000
2. Click **"Sign Up"**
3. Click **"Sign up with Google"**
4. You should see Google login screen (no more 400 error!)

---

## 🚀 Common Issues & Solutions

### Issue 1: Still Getting 400 Error

**Solution:**

1. Check Client ID is copied correctly (no spaces)
2. Check Client Secret is copied correctly
3. Check redirect URI matches exactly: `http://localhost:5000/auth/google/callback`
4. Restart Flask app: Stop and run `python app.py` again
5. Clear browser cache: Press `CTRL+SHIFT+DELETE` then clear

### Issue 2: "Redirect URI mismatch"

**Solution:**

1. Go to Google Cloud Console → Credentials
2. Click on your OAuth 2.0 Client ID
3. Edit and check **Authorized redirect URIs**
4. Ensure it has: `http://localhost:5000/auth/google/callback`
5. Click **Save**

### Issue 3: "Client ID not set"

**Solution:**

1. Make sure .env file exists in ResumeLens folder
2. Check that GOOGLE_CLIENT_ID is not empty in .env
3. Restart Flask app

### Issue 4: "The OAuth client was not found"

**Solution:**

1. Go to https://console.cloud.google.com/
2. Select your ResumeLens project (top left)
3. Go to Credentials
4. Check that your OAuth 2.0 Client ID exists
5. If missing, create a new one following steps above

---

## 🌐 For Production Deployment

### When Deploying to Heroku/AWS

1. **Add Production Redirect URI:**
   - Go to Google Cloud Console
   - Edit your OAuth Client ID
   - Add: `https://your-domain.com/auth/google/callback`
   - Click Save

2. **Set Environment Variables:**

   ```bash
   # Heroku
   heroku config:set GOOGLE_CLIENT_ID=your-id
   heroku config:set GOOGLE_CLIENT_SECRET=your-secret
   heroku config:set GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback
   ```

3. **Update .env in production:**
   - Update GOOGLE_REDIRECT_URI
   - Update SERVER_NAME
   - Set PREFERRED_URL_SCHEME=https

---

## 🔒 Security Best Practices

✅ **DO:**

- Keep Client Secret private
- Add .env to .gitignore
- Use HTTPS in production
- Rotate secrets periodically
- Delete unused OAuth projects

❌ **DON'T:**

- Commit .env to Git
- Share Client Secret publicly
- Use production secret in development
- Hardcode credentials in code
- Use same credentials for multiple environments

---

## 📚 Quick Reference

### .env Template

```bash
GOOGLE_CLIENT_ID=your-client-id-from-google-console
GOOGLE_CLIENT_SECRET=your-client-secret-from-google-console
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
```

### Redirect URI Format

```
http://localhost:5000/auth/google/callback  (local)
https://yourdomain.com/auth/google/callback (production)
```

### Endpoints

- **Sign Up with Google**: http://127.0.0.1:5000/auth/google
- **OAuth Callback**: http://127.0.0.1:5000/auth/google/callback
- **Profile**: http://127.0.0.1:5000/auth/profile

---

## 🆘 Still Having Issues?

1. **Check Google Cloud Console:**
   - Project selected correctly? (top left)
   - Credentials created? (APIs & Services → Credentials)
   - Redirect URIs added? (Click your Client ID to verify)

2. **Check .env File:**
   - File exists in ResumeLens folder?
   - GOOGLE_CLIENT_ID not empty?
   - GOOGLE_CLIENT_SECRET not empty?
   - No extra spaces or quotes?

3. **Check Flask App:**
   - Restarted after updating .env? (Stop and restart)
   - No errors in console? (Check terminal output)
   - Using correct URL? (http://127.0.0.1:5000)

4. **Check Browser:**
   - Cleared cache? (CTRL+SHIFT+DELETE)
   - In incognito/private mode? (Ctrl+Shift+N)
   - Cookies allowed?

---

## ✨ After Setup

Once Google OAuth is working:

- ✅ Click "Sign up with Google"
- ✅ Authenticate with your Google account
- ✅ Account created automatically
- ✅ Access resume analyzer
- ✅ Profile shows Google avatar and name

---

**Need More Help?**

- Check DEPLOYMENT.md for production setup
- Review README.md for feature overview
- Check app logs for errors

**Google OAuth is now configured! 🎉**
