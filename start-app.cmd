@echo off
echo ===================================================
echo PA College Engineering Campus Map Application
echo ===================================================
echo Starting the campus map application...

echo:
echo Step 1: Setting up the database...
call setup-database.cmd

echo:
echo Step 2: Checking database connection...
call test-db-connection.cmd
if %errorlevel% neq 0 (
    echo Database connection failed. Please check your PostgreSQL installation.
    goto :error
)

echo:
echo Step 3: Seeding the database with sample data...
call seed-database.cmd

echo:
echo Step 4: Starting the application...
call start-with-db.cmd

goto :eof

:error
echo:
echo There was an error starting the application.
echo Please check the error messages above.
pause
exit /b 1
