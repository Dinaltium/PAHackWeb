@echo off
echo ===================================================
echo PA College Engineering - Campus Map Setup
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
    echo Make sure psql command is in your PATH environment variable.
    goto :error
)

REM Set PostgreSQL credentials
set PGUSER=postgres
set PGPASSWORD=rafan
set PGHOST=localhost
set PGPORT=5432
set PGDATABASE=hackpace
set DATABASE_URL=postgres://%PGUSER%:%PGPASSWORD%@%PGHOST%:%PGPORT%/%PGDATABASE%

echo:
echo Database configuration:
echo User: %PGUSER%
echo Host: %PGHOST%:%PGPORT%
echo Database: %PGDATABASE%
echo:

echo Step 1: Setting up database...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "SELECT 1 FROM pg_database WHERE datname = '%PGDATABASE%'" | findstr /C:"1 row" > nul
if %errorlevel% neq 0 (
  echo Creating database %PGDATABASE%...
  psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "CREATE DATABASE %PGDATABASE%"
  if %errorlevel% neq 0 goto :db_error
) else (
  echo Database %PGDATABASE% already exists.
)

echo:
echo Step 2: Creating schema and tables...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -f database/schema.sql
if %errorlevel% neq 0 goto :db_error

echo:
echo Step 3: Testing database connection...
node database/db-connection-test.mjs
if %errorlevel% neq 0 goto :db_error

echo:
echo Step 4: Inserting campus map data...
node database/seed-data.mjs
if %errorlevel% neq 0 goto :db_error

echo:
echo ===================================================
echo Database setup completed successfully!
echo:
echo Run 'start-with-db.cmd' to start the application.
echo ===================================================
goto :end

:db_error
echo:
echo Database operation failed. Please check your PostgreSQL installation and credentials.
goto :error

:error
echo:
echo Setup failed. Please fix the issues and try again.
exit /b 1

:end
exit /b 0
