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
├── .env.example                # Environment variables template
├── .env                        # Local environment config (git-ignored)
├── .gitignore                  # Git ignore patterns
├── README.md                   # This file
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

---

**Made with ❤️ to help you land your dream job**

## ⚠️ Disclaimer

This tool provides an estimate of ATS compatibility based on common ATS systems and best practices. Results may vary depending on the specific ATS system used by each company. Always review job requirements carefully and customize your resume accordingly.

**Last Updated**: 2026
**Version**: 2.0 (Full-Stack with Auth)

## Live Demo Available
```
https://resume-lens-9som.onrender.com
```
