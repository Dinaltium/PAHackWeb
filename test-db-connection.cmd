@echo off
echo Testing PostgreSQL connection...

REM Use environment variables set in setup-database.cmd
if exist "%PGUSER%" (
  echo Using environment variables for PostgreSQL connection
) else (
  REM Set default environment variables in case they're not set
  set PGUSER=postgres
  set PGPASSWORD=rafan
  set PGHOST=localhost
  set PGPORT=5432
  set PGDATABASE=hackpace
)

node database/db-connection-test.mjs

if %errorlevel% neq 0 (
    echo Failed to connect to the database.
    exit /b 1
) else (
    exit /b 0
)
