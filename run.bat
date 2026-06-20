@echo off
REM ResumeLens Startup Script for Windows

echo.
echo ======================================
echo   ResumeLens - AI Resume Analyzer
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if requirements are installed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
)

REM Start the Flask application
echo Starting ResumeLens...
echo.
echo Opening http://127.0.0.1:5000 in your browser...
echo.
echo Press CTRL+C to stop the server
echo.

python app.py

pause
