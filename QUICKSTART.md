# 🚀 Quick Start Guide - ResumeLens v2.0

## ⚡ Start in 3 Minutes

### Step 1: Install Dependencies (1 minute)

```bash
cd ResumeLens
pip install -r requirements.txt
```

### Step 2: Run the App (< 1 minute)

```bash
python app.py
```

### Step 3: Visit and Test (< 1 minute)

- Open: http://127.0.0.1:5000
- Click "Sign Up"
- Create an account OR use Google (optional)
- Upload a resume PDF/DOCX
- Paste job description
- Click "Analyze"
- See results and recommendations!

---

## 📝 Test Credentials (Optional)

After first run, you can create a test user via Python:

```python
python
>>> from app import app, db
>>> from models import User
>>> with app.app_context():
>>>     user = User(username='testuser', email='test@example.com')
>>>     user.set_password('test123')
>>>     db.session.add(user)
>>>     db.session.commit()
>>> exit()
```

Then login with:

- Email: `test@example.com`
- Password: `test123`

---

## 🌐 Deploy to Heroku (5 minutes)

```bash
# 1. Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli

# 2. Create app
heroku create your-app-name

# 3. Add database
heroku addons:create heroku-postgresql:hobby-dev

# 4. Set environment variables
heroku config:set SECRET_KEY=your-super-secret-key-change-this
heroku config:set GOOGLE_CLIENT_ID=your-id  # Optional: for Google OAuth
heroku config:set GOOGLE_CLIENT_SECRET=your-secret  # Optional

# 5. Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# 6. Open
heroku open
```

---

## 🐳 Deploy with Docker (3 minutes)

```bash
# 1. Make sure Docker is installed
docker --version

# 2. Update .env if needed (optional)
# nano .env

# 3. Start with Docker Compose
docker-compose up -d

# 4. Initialize database
docker-compose exec web flask init_db

# 5. Visit http://localhost:5000
```

To stop:

```bash
docker-compose down
```

---

## 📚 Full Documentation

- **Complete Setup**: See README.md
- **Deployment Options**: See DEPLOYMENT.md
- **Implementation Details**: See IMPLEMENTATION_SUMMARY.md

---

## ✨ Features at a Glance

✅ AI Resume Analyzer (ATS scoring)
✅ User Authentication (Email + Google OAuth)
✅ User Profiles & History
✅ Database Persistence
✅ Dark/Light Theme
✅ Responsive Design
✅ Drag & Drop File Upload
✅ PDF & DOCX Support
✅ Production Ready
✅ Docker & Heroku Ready

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Reset Database

```bash
rm instance/resumelens.db
python app.py
```

### Google OAuth Not Working

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add redirect URI: `http://localhost:5000/auth/google/callback`
4. Copy Client ID and Secret
5. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-id
   GOOGLE_CLIENT_SECRET=your-secret
   ```
6. Restart app

---

## 🎯 Next Steps After Getting Started

1. **Test Locally** - Run `python app.py` and try the analyzer
2. **Setup Google OAuth** - (Optional) Add Google login
3. **Deploy** - Choose Heroku or Docker
4. **Monitor** - Check logs and user feedback
5. **Enhance** - Add features based on user needs

---

## 💡 Tips

- **First time?** Start with local testing (Step 1-3 above)
- **Want to deploy?** Heroku is easiest (5 minutes)
- **Prefer Docker?** Use docker-compose (3 minutes)
- **Need help?** Check DEPLOYMENT.md for detailed guides
- **Issues?** See Troubleshooting section above

---

## 🆘 Support

1. Check this file (Quick Start Guide)
2. See README.md for features & usage
3. See DEPLOYMENT.md for deployment issues
4. Check application logs for errors

---

**Ready? Run `python app.py` now! 🚀**
