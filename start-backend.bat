@echo off
echo ========================================
echo Starting E-Challan Backend Server
echo ========================================
echo.

cd backend

echo Checking if MongoDB is accessible...
echo.

echo Starting development server...
call npm run dev

pause
