# ResumeLens Startup Script for Windows PowerShell

Write-Host ""
Write-Host "======================================"
Write-Host "  ResumeLens - AI Resume Analyzer"
Write-Host "======================================"
Write-Host ""

# Check if Python is installed
try {
    python --version | Out-Null
}
catch {
    Write-Host "Error: Python is not installed or not in PATH"
    Write-Host "Please install Python from https://www.python.org/downloads/"
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Flask is installed
try {
    python -c "import flask" 2>$null
}
catch {
    Write-Host "Installing dependencies..."
    pip install -r requirements.txt
}

# Start the Flask application
Write-Host "Starting ResumeLens..."
Write-Host ""
Write-Host "Opening http://127.0.0.1:5000 in your browser..."
Write-Host ""
Write-Host "Press CTRL+C to stop the server"
Write-Host ""

python app.py

Read-Host "Press Enter to exit"
