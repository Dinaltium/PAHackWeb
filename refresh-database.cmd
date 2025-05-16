@echo off
echo ===================================================
echo Refreshing PA College Engineering Campus Map Database
echo ===================================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js and try again.
    goto :error
)

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo PostgreSQL is not installed or not in PATH. Please install PostgreSQL and try again.
    goto :error
)

echo Stopping any running instances...
taskkill /IM node.exe /F 2>NUL

REM Set PostgreSQL credentials - make sure these match your PostgreSQL configuration
set PGUSER=postgres
set PGPASSWORD=rafan
set PGHOST=localhost
set PGPORT=5432
set PGDATABASE=hackpace
set DATABASE_URL=postgres://%PGUSER%:%PGPASSWORD%@%PGHOST%:%PGPORT%/%PGDATABASE%

echo.
echo Using PostgreSQL credentials:
echo   User: %PGUSER%
echo   Host: %PGHOST%:%PGPORT%
echo   Database: %PGDATABASE%

echo.
echo Step 1: Dropping existing database...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "DROP DATABASE IF EXISTS %PGDATABASE%"
if %errorlevel% neq 0 (
    echo Failed to drop database. Please check your PostgreSQL permissions.
    goto :error
)

echo.
echo Step 2: Creating new database...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "CREATE DATABASE %PGDATABASE% WITH ENCODING 'UTF8'"
if %errorlevel% neq 0 (
    echo Failed to create database. Please check your PostgreSQL permissions.
    goto :error
)

echo.
echo Step 3: Creating tables...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -f database/schema.sql
if %errorlevel% neq 0 (
    echo Warning: Issues detected while creating tables. Continuing anyway...
)

echo.
echo Testing database connection...
call test-db-connection.cmd
if %errorlevel% neq 0 (
    echo Database connection test failed, but continuing with seed process...
    echo You may need to check your PostgreSQL connection later.
)

echo.
echo Seeding database with updated building coordinates...
call seed-database.cmd

echo.
echo Database refresh complete!
echo You can now run start-with-db.cmd to launch the application
echo ===================================================

goto :eof

:error
echo.
echo There was an error refreshing the database.
pause
exit /b 1
