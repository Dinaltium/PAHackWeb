@echo off
SET NODE_ENV=development
echo Starting server in development mode...
cd /d "%~dp0"
npx tsx server/index.ts
pause
