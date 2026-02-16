@echo off
echo ========================================
echo E-Challan System - Setup Script
echo ========================================
echo.

echo Step 1: Checking MongoDB...
echo Please ensure MongoDB is running at mongodb://localhost:27017/
echo.
echo If MongoDB is not installed, download it from:
echo https://www.mongodb.com/try/download/community
echo.

pause

echo.
echo Step 2: Installing dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 3: Seeding database...
call npm run seed
if %errorlevel% neq 0 (
    echo Failed to seed database. Make sure MongoDB is running!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo You can now start the backend server with:
echo   cd backend
echo   npm run dev
echo.
pause
