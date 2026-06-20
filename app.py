import os
from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_login import LoginManager, login_required, current_user
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
from models import db, User, Analysis
from auth import auth_bp

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, template_folder='templates', static_folder='static')

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///resumelens.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SECURE'] = os.getenv('FLASK_ENV') == 'production'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = 86400 * 7  # 7 days

# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Please log in to access this page'

# Initialize OAuth
oauth = OAuth()
oauth.init_app(app)
oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# User loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register blueprints
app.register_blueprint(auth_bp)

# Create tables and initialize database
@app.before_request
def create_tables():
    """Create database tables if they don't exist"""
    if not os.path.exists('instance'):
        os.makedirs('instance', exist_ok=True)
    db.create_all()

# Routes
@app.route('/')
def index():
    """Home page"""
    if current_user.is_authenticated:
        return render_template('index.html')
    return render_template('landing.html')

@app.route('/analyzer')
@login_required
def analyzer():
    """Resume analyzer page (requires login)"""
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
@login_required
def analyze():
    """Handle resume analysis via API"""
    try:
        data = request.json
        resume_text = data.get('resume_text', '')
        job_description = data.get('job_description', '')
        
        if not resume_text or not job_description:
            return jsonify({'error': 'Resume and job description are required'}), 400
        
        # All analysis is done client-side with JavaScript
        # This endpoint is here for future server-side processing or data storage
        
        # Save analysis to database
        analysis = Analysis(
            user_id=current_user.id,
            resume_text=resume_text[:5000],  # Store first 5000 chars
            job_description=job_description[:2000],  # Store first 2000 chars
            ats_score=data.get('ats_score'),
            keyword_match=data.get('keyword_match'),
            skills_match=data.get('skills_match'),
            section_score=data.get('section_score'),
            content_length_score=data.get('content_length_score'),
            matched_keywords=data.get('matched_keywords'),
            missing_keywords=data.get('missing_keywords'),
            matched_skills=data.get('matched_skills'),
            missing_skills=data.get('missing_skills'),
            detected_sections=data.get('detected_sections'),
            recommendations=data.get('recommendations')
        )
        
        db.session.add(analysis)
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Analysis saved successfully',
            'analysis_id': analysis.id
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyses')
@login_required
def get_analyses():
    """Get user's analysis history"""
    try:
        analyses = Analysis.query.filter_by(user_id=current_user.id).order_by(
            Analysis.created_at.desc()
        ).limit(50).all()
        
        return jsonify({
            'status': 'success',
            'analyses': [{
                'id': a.id,
                'created_at': a.created_at.isoformat(),
                'ats_score': a.ats_score,
                'keyword_match': a.keyword_match,
                'skills_match': a.skills_match
            } for a in analyses]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analysis/<int:analysis_id>')
@login_required
def get_analysis(analysis_id):
    """Get specific analysis details"""
    try:
        analysis = Analysis.query.get(analysis_id)
        
        if not analysis or analysis.user_id != current_user.id:
            return jsonify({'error': 'Analysis not found or access denied'}), 404
        
        return jsonify({
            'status': 'success',
            'analysis': {
                'id': analysis.id,
                'created_at': analysis.created_at.isoformat(),
                'ats_score': analysis.ats_score,
                'keyword_match': analysis.keyword_match,
                'skills_match': analysis.skills_match,
                'section_score': analysis.section_score,
                'content_length_score': analysis.content_length_score,
                'matched_keywords': analysis.matched_keywords,
                'missing_keywords': analysis.missing_keywords,
                'matched_skills': analysis.matched_skills,
                'missing_skills': analysis.missing_skills,
                'detected_sections': analysis.detected_sections,
                'recommendations': analysis.recommendations
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    db.session.rollback()
    return render_template('500.html'), 500

# CLI Commands
@app.cli.command()
def init_db():
    """Initialize the database."""
    db.create_all()
    print('Database initialized.')

@app.cli.command()
def create_admin():
    """Create an admin user."""
    username = input('Enter username: ')
    email = input('Enter email: ')
    password = input('Enter password: ')
    
    if User.query.filter_by(email=email).first():
        print('User already exists!')
        return
    
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    print(f'Admin user {username} created successfully!')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug, host='127.0.0.1', port=port)
