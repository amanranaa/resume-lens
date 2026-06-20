from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255))
    
    # OAuth fields
    google_id = db.Column(db.String(120), unique=True, nullable=True, index=True)
    google_token = db.Column(db.String(500), nullable=True)
    
    # Profile info
    full_name = db.Column(db.String(120), nullable=True)
    profile_picture = db.Column(db.String(500), nullable=True)
    
    # Account status
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with analyses
    analyses = db.relationship('Analysis', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password matches hash"""
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)
    
    def is_oauth_user(self):
        """Check if user registered via OAuth"""
        return self.google_id is not None


class Analysis(db.Model):
    """Resume analysis history model"""
    __tablename__ = 'analyses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Analysis data
    resume_text = db.Column(db.Text)
    job_description = db.Column(db.Text)
    ats_score = db.Column(db.Float)
    keyword_match = db.Column(db.Float)
    skills_match = db.Column(db.Float)
    section_score = db.Column(db.Float)
    content_length_score = db.Column(db.Float)
    
    # Results
    matched_keywords = db.Column(db.JSON)
    missing_keywords = db.Column(db.JSON)
    matched_skills = db.Column(db.JSON)
    missing_skills = db.Column(db.JSON)
    detected_sections = db.Column(db.JSON)
    recommendations = db.Column(db.JSON)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Analysis {self.id} for User {self.user_id}>'
