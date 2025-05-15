@echo off
echo Setting up PostgreSQL connection...

REM Replace these with your actual PostgreSQL connection details
set PGUSER=postgres
set PGPASSWORD=rafan
set PGHOST=localhost
set PGPORT=5432
set PGDATABASE=hackpace

REM Set the DATABASE_URL environment variable for the application
set DATABASE_URL=postgres://%PGUSER%:%PGPASSWORD%@%PGHOST%:%PGPORT%/%PGDATABASE%

echo Database URL set to: %DATABASE_URL%

REM Create the database if it doesn't exist
echo Checking if database exists...
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "SELECT 1 FROM pg_database WHERE datname = '%PGDATABASE%'" | findstr /C:"1 row" > nul
if errorlevel 1 (
  echo Creating database %PGDATABASE%...
  psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -c "CREATE DATABASE %PGDATABASE%"
) else (
  echo Database %PGDATABASE% already exists.
)

REM Run database migrations
echo Running database migrations...
npx drizzle-kit push

echo PostgreSQL setup complete!
echo.
echo Now you can start the application with:
echo npm run dev
echo.
pause
