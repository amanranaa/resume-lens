# ResumeLens — AI Resume Analyzer

An intelligent, production-ready resume analysis tool with user authentication, database persistence, and deployment-ready architecture. Get ATS (Applicant Tracking System) compatibility scores and personalized recommendations to help you optimize your resume for job applications.

## 🌟 Features

### Core AI Features
✨ **AI-Powered Analysis**
- ATS compatibility scoring (0-100 scale)
- Keyword matching against job descriptions
- Technical and soft skills detection (70+ tech skills, 45+ soft skills)
- Resume section validation
- Content depth analysis

📊 **Interactive Dashboards**
- Visual score cards with animated progress rings
- Radar charts for skill breakdown
- Doughnut charts for keyword distribution
- Skill matching bar charts
- Section detection visualization
- Analysis history

🎯 **Smart Recommendations**
- Personalized improvement suggestions
- Priority-ranked recommendations
- Actionable step-by-step plans
- Real-time tips based on your resume

### 🔐 Authentication & Security
- **User Registration** - Email-based signup with password hashing (bcrypt)
- **Email/Password Login** - Secure authentication with session management
- **Google OAuth 2.0** - One-click signup/login with Google accounts
- **User Profiles** - Track profile info, analysis history, account details
- **Secure Sessions** - CSRF protection, secure cookies, HTTP-only flags

### 💾 Data Management
- **Analysis History** - Save and retrieve past analyses
- **User Dashboard** - View all analyses with scores and timestamps
- **Database Storage** - SQLAlchemy ORM with SQLite (dev) / PostgreSQL (prod)
- **Profile Management** - Edit user info, view connected accounts

🎨 **Modern UI**
- Dark/Light theme toggle with persistent storage
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Real-time feedback with toast notifications
- Glass-morphism UI elements

📁 **File Support**
- PDF resume upload with intelligent text extraction (PDF.js)
- DOCX document support (Mammoth.js)
- File size validation (max 5MB)
- Drag-and-drop interface

## 🏗️ Project Structure

```
ResumeLens/
├── app.py                      # Flask application & routes
├── models.py                   # Database models (User, Analysis)
├── auth.py                     # Authentication blueprint
├── requirements.txt            # Python dependencies
├── Procfile                    # Heroku deployment config
├── Dockerfile                  # Docker container config
├── docker-compose.yml          # Docker compose for local dev
├── .env.example                # Environment variables template
├── .env                        # Local environment config (git-ignored)
├── .gitignore                  # Git ignore patterns
├── README.md                   # This file
├── DEPLOYMENT.md               # Complete deployment guide
│
├── templates/                  # Flask HTML templates
│   ├── base.html              # Base template with navbar/footer
│   ├── landing.html           # Landing page for guests
│   ├── index.html             # Main analyzer for authenticated users
│   ├── 404.html               # Not found page
│   ├── 500.html               # Server error page
│   └── auth/
│       ├── signup.html        # Registration page
│       ├── login.html         # Login page
│       └── profile.html       # User profile page
│
├── static/
│   ├── css/
│   │   └── styles.css         # Complete stylesheet & animations
│   └── js/
│       └── script.js          # Analysis engine & UI logic
│
└── instance/                  # Instance folder (auto-created)
    └── resumelens.db          # SQLite database (dev)
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.8+
- pip and virtualenv
- Git (optional)

### 1. Setup

```bash
# Navigate to project
cd ResumeLens

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy template (already provided as .env)
cp .env.example .env

# Edit .env if needed
# FLASK_ENV=development
# DATABASE_URL=sqlite:///resumelens.db
# Optional: Add Google OAuth credentials
```

### 3. Run

```bash
python app.py
# Or use the batch file
run.bat  # Windows only
```

Visit: **http://127.0.0.1:5000**

### 4. Create Account

- Click "Sign Up" to create an account
- Or use "Sign Up with Google" (requires Google OAuth setup)
- Start analyzing resumes!

## 🔑 Authentication Setup

### Email/Password Authentication
Works out-of-the-box. No additional configuration needed.

### Google OAuth Setup (Optional)

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project "ResumeLens"

2. **Enable OAuth 2.0**
   - APIs & Services → Credentials
   - Create OAuth 2.0 Client ID (Web application)

3. **Configure Redirect URIs**
   - Local: `http://localhost:5000/auth/google/callback`
   - Production: `https://yourdomain.com/auth/google/callback`

4. **Add Credentials to .env**
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
   ```

For detailed OAuth setup, see [DEPLOYMENT.md](DEPLOYMENT.md#google-oauth-setup)

## 📊 How the Analysis Works

### Resume Analysis Algorithm

1. **Keyword Extraction**
   - Extracts keywords from job description
   - Filters out common stop words (110+ English words)
   - Prioritizes technical skills (matches against 70+ tech skills database)
   - Calculates frequency and relevance scores

2. **Skill Matching**
   - Identifies technical skills in resume (70+ skills)
   - Detects soft skills presence (45+ skills)
   - Compares against job requirements
   - Calculates match percentages

3. **Section Detection**
   - Identifies resume sections:
     - Contact Info, Professional Summary, Skills
     - Work Experience, Education, Projects
     - Certifications, Achievements
   - Validates structural completeness

4. **ATS Score Calculation** (Weighted Formula)
   - Keyword match: 35% weight
   - Skills match: 30% weight
   - Section completeness: 20% weight
   - Content depth: 15% weight

### Client-Side Processing
✅ **All analysis happens in your browser!**
- PDF extraction with PDF.js library
- DOCX parsing with Mammoth.js
- Analysis algorithms run 100% client-side
- Your resume data is **never sent to servers**
- Works offline after page loads

## 🗄️ Database

### Local Development (SQLite)
- Automatic setup - no configuration needed
- Database file: `resumelens.db`
- Perfect for development and testing

### Production (PostgreSQL)
- Recommended for production deployments
- Managed by Heroku, AWS RDS, etc.
- Automatic with deployment platforms

### Database Models

**User Model**
```
- id (Primary Key)
- username (unique)
- email (unique)
- password_hash (bcrypted)
- google_id (for OAuth)
- google_token
- full_name
- profile_picture
- is_active
- created_at, updated_at
- analyses (relationship)
```

**Analysis Model**
```
- id (Primary Key)
- user_id (Foreign Key → users)
- resume_text
- job_description
- ats_score, keyword_match, skills_match, section_score, content_length_score
- matched_keywords, missing_keywords
- matched_skills, missing_skills
- detected_sections
- recommendations (JSON)
- created_at, updated_at
```

## 🚢 Deployment

### Quick Deployment Options

**Heroku (Recommended - Easiest)**
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set SECRET_KEY=your-secret
heroku config:set GOOGLE_CLIENT_ID=your-id
heroku config:set GOOGLE_CLIENT_SECRET=your-secret
git push heroku main
```

**Docker**
```bash
docker-compose up -d
# Visit http://localhost:5000
```

**AWS / EC2 / VPS**
See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions

For complete deployment guide with Heroku, AWS, Docker, and troubleshooting:
👉 **See [DEPLOYMENT.md](DEPLOYMENT.md)**

## 🛠️ Technology Stack

### Backend
- **Flask 3.0** - Web framework
- **SQLAlchemy** - ORM for databases
- **Flask-Login** - User session management
- **authlib** - OAuth 2.0 integration
- **bcrypt** - Password hashing
- **Gunicorn** - Production WSGI server

### Frontend
- **HTML5 & CSS3** - Structure & styling
- **JavaScript ES6+** - Client-side analysis
- **Bootstrap 5** - Responsive grid
- **Chart.js** - Interactive charts
- **Font Awesome 6** - Icons
- **Google Fonts** - Typography

### File Processing
- **PDF.js** - PDF text extraction
- **Mammoth.js** - DOCX parsing

### Infrastructure
- **SQLite** - Development database
- **PostgreSQL** - Production database
- **Docker & Docker Compose** - Containerization
- **Gunicorn** - App server
- **Nginx** - Reverse proxy (production)

## 💡 Tips for Best Results

### Resume Format
- Clean, single-column layout preferred
- Avoid tables and complex formatting
- Save as PDF with selectable text (not scanned image)
- Use standard section headings

### Content
- Aim for 400-900 words depending on experience
- Use action verbs (Architected, Spearheaded, Optimized)
- Include quantifiable metrics (%, $, time saved)
- Tailor to each job description

### Keywords
- Mirror language from job posting
- Include specific technologies mentioned
- List relevant certifications
- Use industry-standard terminology

### Sections
- Include all relevant resume sections
- Professional summary at the top
- Detailed work experience with achievements
- Technical and soft skills list
- Education and certifications
- Optional: Projects and achievements

## 🔒 Privacy & Security

✅ **Your data is completely safe:**
- ✅ All analysis happens in your browser (client-side)
- ✅ No resume uploaded to servers
- ✅ No personal data collected or tracked
- ✅ No external API calls for analysis
- ✅ Works offline after initial page load
- ✅ Passwords hashed with bcrypt
- ✅ Secure session cookies (HTTP-only, Secure flag)
- ✅ CSRF protection enabled
- ✅ SQL injection protection (SQLAlchemy ORM)

## 🐛 Troubleshooting

### "Port 5000 already in use"
```bash
# Windows: Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port in app.py
app.run(port=5001)
```

### "PDF file not being read"
- Ensure PDF has selectable text (not scanned image)
- Try converting to DOCX format
- Check file size is under 5MB

### "Charts not displaying"
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Clear browser cache and reload

### "Google OAuth not working"
- Verify Client ID and Secret in .env
- Add correct redirect URI in Google Cloud Console
- Make sure you're on HTTPS in production

### Database errors
```bash
# Reset database (dev only!)
rm instance/resumelens.db
python app.py  # Will recreate

# Check database connection
python
>>> from app import app, db
>>> with app.app_context(): db.session.execute('SELECT 1')
```

## 📈 Future Enhancements

- [ ] LinkedIn resume import
- [ ] Multi-file batch analysis
- [ ] Resume formatting suggestions
- [ ] Cover letter optimization
- [ ] Skill gap analysis with learning paths
- [ ] Export analysis to PDF report
- [ ] Saved analysis history with trends
- [ ] API for third-party integration
- [ ] Email notifications for job matches
- [ ] Salary data integration

## 🤝 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

Having issues? 
1. Check [DEPLOYMENT.md](DEPLOYMENT.md#troubleshooting) for deployment issues
2. Review error messages in browser console (F12)
3. Check application logs
4. Open an issue on GitHub with details

## 🎓 Learn More

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Heroku Deployment](https://devcenter.heroku.com/)
- [Docker Documentation](https://docs.docker.com/)

---

**Made with ❤️ to help you land your dream job**

## ⚠️ Disclaimer

This tool provides an estimate of ATS compatibility based on common ATS systems and best practices. Results may vary depending on the specific ATS system used by each company. Always review job requirements carefully and customize your resume accordingly.

**Last Updated**: 2024
**Version**: 2.0 (Full-Stack with Auth)
