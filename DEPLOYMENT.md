# ResumeLens - Complete Deployment Guide

Complete step-by-step guide to deploy ResumeLens to production with authentication and database.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [Google OAuth Setup](#google-oauth-setup)
4. [Deployment Options](#deployment-options)
   - [Heroku (Recommended - Easiest)](#heroku-recommended)
   - [AWS Elastic Beanstalk](#aws-elastic-beanstalk)
   - [AWS EC2 (Manual)](#aws-ec2-manual)
   - [Docker & Docker Compose](#docker--docker-compose)
5. [Database Configuration](#database-configuration)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

- **Google Cloud Console** - For OAuth credentials
- **Git** - For version control
- **One of:** Heroku, AWS, or Docker Hub account

### Local Requirements

- Python 3.8+
- PostgreSQL (optional, for local development)
- pip and virtualenv

---

## Local Setup

### 1. Clone or Extract Project

```bash
cd ResumeLens
```

### 2. Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Create .env File

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Edit `.env`:

```
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-random-secret-key-here
DATABASE_URL=sqlite:///resumelens.db
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
```

### 5. Initialize Database

```bash
flask db init
```

Or in Python shell:

```python
from app import app, db
with app.app_context():
    db.create_all()
```

### 6. Run Locally

```bash
python app.py
```

Visit: http://localhost:5000

---

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter project name: `ResumeLens`
4. Click "Create"

### Step 2: Enable OAuth 2.0

1. Left sidebar → "APIs & Services" → "Credentials"
2. Click "+ Create Credentials" → "OAuth Client ID"
3. If prompted, click "Configure OAuth Consent Screen" first:
   - User Type: "External"
   - Fill App Information:
     - App name: "ResumeLens"
     - User support email: Your email
     - Developer contact: Your email
   - Scopes: Add "openid", "email", "profile"
   - Test users: Add your email
   - Back to Credentials

### Step 3: Create OAuth Credentials

1. Click "+ Create Credentials" → "OAuth Client ID"
2. Application type: "Web application"
3. Name: "ResumeLens Web"
4. Authorized redirect URIs:
   ```
   http://localhost:5000/auth/google/callback
   https://yourdomain.com/auth/google/callback (for production)
   ```
5. Click "Create"
6. Copy Client ID and Client Secret
7. Save to `.env`:

```
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

---

## Deployment Options

### HEROKU (RECOMMENDED)

#### Advantages

- ✅ Easiest setup
- ✅ Free tier available
- ✅ Built-in PostgreSQL
- ✅ One-click deployment

#### Step 1: Install Heroku CLI

Download from: https://devcenter.heroku.com/articles/heroku-cli

```bash
heroku --version
```

#### Step 2: Login to Heroku

```bash
heroku login
```

#### Step 3: Create Heroku App

```bash
heroku create your-app-name
# Example: heroku create resumelens-app
```

#### Step 4: Add PostgreSQL

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

Get database URL:

```bash
heroku config:get DATABASE_URL
```

#### Step 5: Set Environment Variables

```bash
heroku config:set FLASK_ENV=production
heroku config:set SECRET_KEY=your-random-secret-key-32-chars-min
heroku config:set GOOGLE_CLIENT_ID=your-client-id
heroku config:set GOOGLE_CLIENT_SECRET=your-client-secret
heroku config:set GOOGLE_REDIRECT_URI=https://your-app-name.herokuapp.com/auth/google/callback
```

Update Google OAuth settings:

1. Go to Google Cloud Console
2. Add redirect URI: `https://your-app-name.herokuapp.com/auth/google/callback`

#### Step 6: Create Procfile

File: `Procfile` (no extension, in root directory)

```
web: gunicorn app:app
release: flask db upgrade
```

#### Step 7: Initialize Database

```bash
heroku run flask db init
heroku run flask init_db
```

#### Step 8: Deploy

```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Step 9: Check Logs

```bash
heroku logs --tail
```

#### Step 10: Open App

```bash
heroku open
```

---

### AWS ELASTIC BEANSTALK

#### Step 1: Install EB CLI

```bash
pip install awseb
```

#### Step 2: Initialize Elastic Beanstalk

```bash
eb init -p python-3.11 resumelens --region us-east-1
```

#### Step 3: Create Environment

```bash
eb create resumelens-env
```

#### Step 4: Configure Environment Variables

Create `.ebextensions/config.yaml`:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    FLASK_ENV: production
    SECRET_KEY: your-secret-key
    GOOGLE_CLIENT_ID: your-client-id
    GOOGLE_CLIENT_SECRET: your-client-secret
    DATABASE_URL: postgresql://user:password@rds-endpoint/dbname
```

#### Step 5: Deploy

```bash
eb deploy
```

#### Step 6: Open App

```bash
eb open
```

---

### AWS EC2 (MANUAL)

#### Step 1: Launch EC2 Instance

1. AWS Console → EC2 → Launch Instance
2. Select: Amazon Linux 2
3. Instance type: t2.micro (free tier)
4. Storage: 30GB
5. Security Group: Allow ports 80, 443, 22
6. Create/select key pair
7. Launch

#### Step 2: Connect to Instance

```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

#### Step 3: Install Dependencies

```bash
sudo yum update -y
sudo yum install python3 python3-pip python3-venv -y
sudo yum install postgresql-devel -y
sudo yum install nginx -y
```

#### Step 4: Clone Project

```bash
git clone https://github.com/yourusername/resumelens.git
cd resumelens
```

#### Step 5: Setup Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

#### Step 6: Configure Environment

```bash
nano .env
# Add all environment variables
```

#### Step 7: Initialize Database

```bash
flask db init
flask init_db
```

#### Step 8: Start Gunicorn

```bash
gunicorn --bind 0.0.0.0:8000 app:app &
```

#### Step 9: Configure Nginx

Edit `/etc/nginx/sites-available/default`:

```nginx
upstream resumelens {
    server 127.0.0.1:8000;
}

server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://resumelens;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

#### Step 10: Enable SSL

```bash
sudo amazon-linux-extras install nginx1 -y
sudo certbot certonly --standalone -d your-domain.com
```

---

### DOCKER & DOCKER COMPOSE

#### Step 1: Create Dockerfile

File: `Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

#### Step 2: Create docker-compose.yml

```yaml
version: "3.8"

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=your-secret-key
      - DATABASE_URL=postgresql://resumelens:password@db:5432/resumelens
      - GOOGLE_CLIENT_ID=your-client-id
      - GOOGLE_CLIENT_SECRET=your-client-secret
    depends_on:
      - db
    volumes:
      - ./:/app

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=resumelens
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=resumelens
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Step 3: Build and Run

```bash
docker-compose up -d
docker-compose exec web flask db init
docker-compose exec web flask init_db
```

Visit: http://localhost:5000

---

## Database Configuration

### Local Development (SQLite)

No setup needed - automatic with:

```bash
DATABASE_URL=sqlite:///resumelens.db
```

### PostgreSQL (Production)

#### Create Database

```bash
psql -U postgres
CREATE DATABASE resumelens;
CREATE USER resumelens_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE resumelens TO resumelens_user;
```

#### Connection String

```
postgresql://resumelens_user:your-secure-password@localhost:5432/resumelens
```

---

## Environment Variables

### Required Variables

```bash
# Flask
FLASK_ENV=production
SECRET_KEY=your-random-32-character-string

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id-from-google
GOOGLE_CLIENT_SECRET=your-secret-from-google
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback

# Server
PREFERRED_URL_SCHEME=https
SERVER_NAME=yourdomain.com
```

### Generate SECRET_KEY

```python
import os
print(os.urandom(24).hex())
```

---

## Post-Deployment

### 1. Verify SSL/HTTPS

Your domain should redirect HTTP to HTTPS automatically.

### 2. Test OAuth Flow

1. Visit deployment URL
2. Click "Sign Up"
3. Sign up with email or Google
4. Test upload and analysis

### 3. Create Admin User

```bash
# Local
python app.py
# Enter in shell: python
from app import app, db
from models import User
with app.app_context():
    user = User(username='admin', email='admin@example.com')
    user.set_password('secure-password')
    db.session.add(user)
    db.session.commit()

# Heroku
heroku run python
# Then same code above

# Docker
docker-compose exec web python
# Then same code above
```

### 4. Monitor Performance

- **Heroku**: `heroku logs --tail`
- **EC2**: Check `/var/log/nginx/access.log`
- **Docker**: `docker-compose logs -f web`

---

## Monitoring & Maintenance

### Backup Database

**PostgreSQL:**

```bash
pg_dump resumelens > backup.sql
```

**Restore:**

```bash
psql resumelens < backup.sql
```

### Update Dependencies

```bash
pip list --outdated
pip install --upgrade package-name
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update dependencies"
git push
```

### Monitor Errors

Set up error logging:

```python
import logging
logging.basicConfig(filename='error.log', level=logging.ERROR)
```

---

## Troubleshooting

### Issue: "Redirect URI mismatch"

**Solution:** Update Google OAuth settings with correct callback URL

### Issue: "Database connection error"

**Solution:** Verify DATABASE_URL is correct

```bash
# Heroku
heroku config:get DATABASE_URL

# Docker
docker-compose logs db
```

### Issue: "Static files not loading"

**Solution:** Run collect static

```bash
# For production
flask collect-static
```

### Issue: "ModuleNotFoundError"

**Solution:** Reinstall requirements

```bash
pip install -r requirements.txt
```

### Issue: App crashes on startup

**Solution:** Check logs

```bash
# Heroku
heroku logs --tail

# Docker
docker-compose logs web
```

---

## Performance Optimization

### Enable Gzip Compression

Add to nginx config:

```nginx
gzip on;
gzip_types text/plain text/css application/json;
```

### Use CDN

Add to CloudFront/CloudFlare for static files

### Database Optimization

```sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_analysis_user_id ON analyses(user_id);
```

### Connection Pooling

```python
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': 10,
    'pool_recycle': 3600,
    'pool_pre_ping': True,
}
```

---

## Security Checklist

- ✅ Change SECRET_KEY in production
- ✅ Use HTTPS only
- ✅ Set secure database passwords
- ✅ Enable CSRF protection
- ✅ Add rate limiting
- ✅ Use environment variables (never commit secrets)
- ✅ Keep dependencies updated
- ✅ Enable firewall rules
- ✅ Set up regular backups
- ✅ Monitor error logs

---

## Support

For issues:

1. Check logs
2. Review error messages
3. Consult framework documentation
4. Open issue on GitHub

---

**Good luck with your deployment! 🚀**
