@echo off
REM Start both web and mobile versions of the PA College Campus Map

echo ===================================================
echo PA College Engineering Campus Map - Full Launch
echo ===================================================
echo.
echo This script will start both the web and mobile versions
echo of the PA College Campus Map application.
echo.
echo 1. Web application (with database)
echo 2. Mobile application
echo 3. Both web and mobile apps
echo 4. Exit
echo.

set /p choice=Enter your choice (1-4): 

if "%choice%"=="1" (
    echo.
    echo Starting web application...
    echo.
    call start-with-db.cmd
) else if "%choice%"=="2" (
    echo.
    echo Starting mobile application...
    echo.
    call start-mobile.cmd
) else if "%choice%"=="3" (
    echo.
    echo Starting both web and mobile applications...
    echo.
    start cmd /k call start-with-db.cmd
    timeout /t 5 > nul
    start cmd /k call start-mobile.cmd
) else if "%choice%"=="4" (
    echo.
    echo Exiting...
    exit /b 0
) else (
    echo.
    echo Invalid choice. Please try again.
    pause
)

echo ===================================================
pause
