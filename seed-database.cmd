@echo off
echo Inserting sample data into the database...

REM Use environment variables set in setup-database.cmd
if not defined PGUSER (
  REM Set default environment variables in case they're not set
  set PGUSER=postgres
  set PGPASSWORD=rafan
  set PGHOST=localhost
  set PGPORT=5432
  set PGDATABASE=hackpace
)

node database/seed-data.mjs

if %errorlevel% neq 0 (
    echo Failed to seed the database.
    exit /b 1
) else (
    echo Database seeding completed successfully!
    exit /b 0
)
