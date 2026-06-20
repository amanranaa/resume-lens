# ✅ ResumeLens - Setup Checklist

Complete the following steps to get your ResumeLens application fully working with Google OAuth.

---

## 📋 Pre-Setup Checklist

- [ ] Python 3.8+ installed (`python --version`)
- [ ] pip installed (`pip --version`)
- [ ] Git installed (optional)
- [ ] Text editor or IDE available
- [ ] Google account (for OAuth setup)

---

## 🔧 LOCAL SETUP

### Step 1: Install Dependencies

```bash
cd ResumeLens
pip install -r requirements.txt
```

**Expected:** No errors, packages installed successfully

- [ ] Dependencies installed

### Step 2: Verify .env File

Check that `.env` file exists in ResumeLens folder with:

```
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=dev-secret-key-for-testing-only-change-in-production
DATABASE_URL=sqlite:///resumelens.db
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
SERVER_NAME=localhost:5000
PREFERRED_URL_SCHEME=http
```

- [ ] .env file verified

---

## 🔐 GOOGLE OAUTH SETUP

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "Select a Project" → "+ New Project"
3. Name: `ResumeLens`
4. Click Create

**Expected:** Project created (wait 1-2 minutes)

- [ ] Google Cloud project created

### Step 2: Setup OAuth Consent Screen

1. Left sidebar → APIs & Services → Credentials
2. Click "OAuth consent screen" or "Configure Consent Screen"
3. User Type: Select "External"
4. Click Create

**Fill out:**

- App name: `ResumeLens`
- User support email: Your email
- Scopes: Add `openid`, `email`, `profile`
- Test users: Add your email

**Expected:** Consent screen configured

- [ ] OAuth consent screen configured

### Step 3: Create OAuth Client ID

1. Go to Credentials
2. Click "+ Create Credentials"
3. Select "OAuth Client ID"
4. Application type: "Web application"
5. Name: `ResumeLens Web`

**Redirect URIs:**

```
http://localhost:5000/auth/google/callback
```

6. Click Create

**Expected:** Client ID and Secret displayed

- [ ] OAuth Client ID created

### Step 4: Copy Credentials

Copy these from Google Cloud Console:

- Client ID: `xxx.apps.googleusercontent.com`
- Client Secret: `GOCSPX-xxxxxxx`

- [ ] Credentials copied

### Step 5: Update .env File

Edit `ResumeLens\.env`:

```
GOOGLE_CLIENT_ID=paste-client-id-here
GOOGLE_CLIENT_SECRET=paste-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
```

**Example:**

```
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
```

- [ ] .env file updated with credentials

---

## 🚀 TESTING

### Step 1: Start Flask App

```bash
cd ResumeLens
python app.py
```

**Expected:**

```
* Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

- [ ] Flask app started

### Step 2: Visit Web Application

Open browser and go to: `http://127.0.0.1:5000`

**Expected:** ResumeLens landing page loads

- [ ] Web app loads

### Step 3: Test Email Signup

1. Click "Sign Up"
2. Enter username: `testuser`
3. Enter email: `test@example.com`
4. Enter password: `test123456`
5. Confirm password: `test123456`
6. Click "Create Account"

**Expected:** Account created, redirected to login page

- [ ] Email signup works

### Step 4: Login with Email

1. Go to http://127.0.0.1:5000
2. Click "Sign In"
3. Email: `test@example.com`
4. Password: `test123456`
5. Click "Sign In"

**Expected:** Logged in, redirected to analyzer

- [ ] Email login works

### Step 5: Test Google Signup

1. Click "Sign Up"
2. Click "Sign up with Google"
3. If prompted: Choose your Google account
4. Click "Allow" when asked for permissions

**Expected:** Google signup works, account created

- [ ] Google signup works ✅

### Step 6: Test Resume Analyzer

1. Upload a resume (PDF or DOCX)
2. Paste a job description
3. Click "Analyze My Resume"

**Expected:** Analyzer works, shows scores and recommendations

- [ ] Resume analyzer works

### Step 7: Check Profile

1. Click on your avatar/profile menu
2. Click "Profile"

**Expected:** Profile page shows with your info and analysis history

- [ ] Profile page works

---

## 📊 FEATURE VERIFICATION

- [ ] Email registration works
- [ ] Email login works
- [ ] Password hashing works (password stored securely)
- [ ] Google OAuth signup works
- [ ] User profile displays correctly
- [ ] Resume analyzer functions
- [ ] Charts display properly
- [ ] Dark/light theme toggle works
- [ ] Responsive design works on mobile
- [ ] Database persists data
- [ ] Analysis history saves

---

## 🚢 DEPLOYMENT CHECKLIST

### Before Deploying to Production

- [ ] All tests passing
- [ ] .env file NOT committed to Git
- [ ] .gitignore includes .env
- [ ] SECRET_KEY changed to random value
- [ ] Database URL updated to production
- [ ] Google OAuth redirect URIs updated for production domain
- [ ] HTTPS enabled
- [ ] Email validation setup
- [ ] Error logging configured
- [ ] Database backups scheduled

### Deploy to Heroku

- [ ] Heroku CLI installed
- [ ] Procfile configured
- [ ] requirements.txt updated
- [ ] Created Heroku app
- [ ] Added PostgreSQL addon
- [ ] Set environment variables on Heroku
- [ ] Pushed code to Heroku
- [ ] Database migrations run
- [ ] Custom domain configured

See DEPLOYMENT.md for detailed steps

---

## 🔒 SECURITY CHECKLIST

- [ ] Secrets NOT in code
- [ ] .env file in .gitignore
- [ ] Passwords hashed with bcrypt
- [ ] Session cookies secure
- [ ] CSRF protection enabled
- [ ] No SQL injection vulnerabilities
- [ ] HTTPS enforced in production
- [ ] Environment variables configured
- [ ] Database credentials secure
- [ ] OAuth tokens stored securely
- [ ] Regular security updates scheduled

---

## 📱 MOBILE TESTING

- [ ] App loads on mobile browser
- [ ] Touch/click events work
- [ ] File upload works on mobile
- [ ] Responsive layout looks good
- [ ] Theme toggle works on mobile
- [ ] Charts display properly on mobile
- [ ] Forms are usable on mobile

---

## 🐛 TROUBLESHOOTING CHECKLIST

If something doesn't work:

- [ ] Checked browser console (F12)
- [ ] Checked Flask app logs
- [ ] Verified .env file has values
- [ ] Restarted Flask app
- [ ] Cleared browser cache
- [ ] Checked database connection
- [ ] Verified Google credentials
- [ ] Confirmed redirect URIs match
- [ ] Checked network connection
- [ ] Reviewed error messages carefully

See GOOGLE_OAUTH_SETUP.md for common issues

---

## 📚 DOCUMENTATION REVIEW

- [ ] Read README.md
- [ ] Read QUICKSTART.md
- [ ] Read GOOGLE_OAUTH_SETUP.md
- [ ] Read DEPLOYMENT.md (if deploying)
- [ ] Bookmarked documentation

---

## 🎉 FINAL VERIFICATION

- [ ] App runs locally: `python app.py`
- [ ] Can access: http://127.0.0.1:5000
- [ ] Can sign up with email
- [ ] Can login with email
- [ ] Can signup with Google
- [ ] Can upload resume
- [ ] Can analyze resume
- [ ] Can view profile
- [ ] Can see analysis history
- [ ] Dark/light theme works
- [ ] Responsive design works

---

## ✅ SETUP COMPLETE!

Once all items above are checked, your ResumeLens application is fully set up and ready for:

- ✅ Local development
- ✅ Testing
- ✅ Production deployment

---

## 🚀 NEXT STEPS

1. **Test More**: Upload different resumes, try different job descriptions
2. **Customize**: Modify CSS, add features, improve UI
3. **Deploy**: Follow DEPLOYMENT.md to deploy to production
4. **Share**: Share your app with friends for feedback
5. **Enhance**: Add new features based on feedback

---

## 📞 SUPPORT

Having issues?

1. Check GOOGLE_OAUTH_SETUP.md (Troubleshooting section)
2. Review app logs
3. Check browser console (F12)
4. Read STATUS_UPDATE.md for common issues

---

**Congratulations! Your ResumeLens is ready! 🎉**

```
python app.py
# Then visit http://127.0.0.1:5000
```
