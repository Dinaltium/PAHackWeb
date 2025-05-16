@echo off
REM Start the PA College Campus Map mobile app

echo ===================================================
echo PA College Engineering Campus Map - Mobile App
echo ===================================================

cd mobile

echo Installing required dependencies...
call npm install

echo Starting mobile app development server...
echo.
echo When the QR code appears:
echo  - Scan it with your phone's camera
echo  - Open with Expo Go app on your device
echo  - OR press 'a' to open on Android emulator if installed
echo  - OR press 'i' to open on iOS simulator if on Mac
echo.
echo Press Ctrl+C to stop the server when done.
echo ===================================================

call npm start

if %errorlevel% neq 0 (
    echo.
    echo There was an error starting the mobile app.
    echo Make sure all dependencies are installed correctly.
    pause
    exit /b 1
)
