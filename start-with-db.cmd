@echo off
echo Starting application with PostgreSQL connection...

REM Replace these with your actual PostgreSQL connection details
set PGUSER=postgres
set PGPASSWORD=password
set PGHOST=localhost
set PGPORT=5432
set PGDATABASE=pahackweb

REM Set the DATABASE_URL environment variable for the application
set DATABASE_URL=postgres://%PGUSER%:%PGPASSWORD%@%PGHOST%:%PGPORT%/%PGDATABASE%
set NODE_ENV=development

echo Database URL set to: %DATABASE_URL%
echo Starting server in development mode...

npx tsx server/index.ts
pause
