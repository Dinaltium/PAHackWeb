@echo off
echo ===================================================
echo PA College Engineering - Campus Map Application
echo ===================================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js and try again.
    goto :error
)

REM Set PostgreSQL credentials - make sure these match your PostgreSQL configuration
set PGUSER=postgres
set PGPASSWORD=rafan
set PGHOST=localhost
set PGPORT=5432
set PGDATABASE=hackpace
set NODE_ENV=development

REM Set the DATABASE_URL environment variable for the application
set DATABASE_URL=postgres://%PGUSER%:%PGPASSWORD%@%PGHOST%:%PGPORT%/%PGDATABASE%

echo.
echo Using PostgreSQL credentials:
echo   User: %PGUSER%
echo   Host: %PGHOST%:%PGPORT%
echo   Database: %PGDATABASE%

echo.
echo Testing database connection...
node database\db-connection-test.mjs
if %errorlevel% neq 0 (
    echo.
    echo Database connection failed. Would you like to set up the database now? (Y/N)
    set /p SETUP_DB=
    if /i "%SETUP_DB%"=="Y" (
        call setup-campus-map.cmd
        if %errorlevel% neq 0 goto :error
    ) else (
        echo Database setup skipped. Application may not work correctly.
    )
)

echo.
echo Starting server in development mode...
echo ===================================================

npx tsx server/index.ts
if %errorlevel% neq 0 (
    echo.
    echo Server startup failed. Please check the error messages above.
    goto :error
)

goto :end

:error
echo.
echo ===================================================
echo Error occurred. Application may not have started correctly.
echo ===================================================
exit /b 1

:end
pause
echo.
echo Application terminated.
exit /b 0
