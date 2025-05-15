@echo off
setlocal enabledelayedexpansion

REM Set PostgreSQL connection details from setup-database.cmd
for /f "tokens=2 delims==" %%a in ('type setup-database.cmd ^| findstr /C:"set PGUSER"') do set PGUSER=%%a
for /f "tokens=2 delims==" %%a in ('type setup-database.cmd ^| findstr /C:"set PGPASSWORD"') do set PGPASSWORD=%%a
for /f "tokens=2 delims==" %%a in ('type setup-database.cmd ^| findstr /C:"set PGHOST"') do set PGHOST=%%a
for /f "tokens=2 delims==" %%a in ('type setup-database.cmd ^| findstr /C:"set PGPORT"') do set PGPORT=%%a
for /f "tokens=2 delims==" %%a in ('type setup-database.cmd ^| findstr /C:"set PGDATABASE"') do set PGDATABASE=%%a

cls
echo ==================================================
echo      PAHACKWEB APPLICATION DASHBOARD
echo ==================================================
echo.

REM Check if the server is running
set SERVER_RUNNING=0
netstat -ano | findstr ":5000" > nul
if not errorlevel 1 (
    set SERVER_RUNNING=1
    echo [✓] Server status: RUNNING on http://localhost:5000
) else (
    echo [✗] Server status: NOT RUNNING
)
echo.

REM Check PostgreSQL connection
echo Testing PostgreSQL connection...
set DB_CONNECTED=0
psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -c "\q" > nul 2>&1
if not errorlevel 1 (
    set DB_CONNECTED=1
    echo [✓] Database status: CONNECTED to %PGDATABASE%
) else (
    echo [✗] Database status: NOT CONNECTED
)
echo.

REM Table statistics if connected
if !DB_CONNECTED!==1 (
    echo Database table statistics:
    echo ---------------------------------
    for %%t in (users buildings classrooms courses events) do (
        for /f "tokens=1" %%c in ('psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -t -c "SELECT COUNT(*) FROM %%t"') do (
            echo     %%t: %%c records
        )
    )
    echo.
)

REM Show available actions
echo Available actions:
echo ---------------------------------
echo  1. Start the application server
echo  2. View database contents
echo  3. Insert sample data
echo  4. Reset database (caution)
echo  5. Run database migration
echo  6. View application in browser
echo.

echo  0. Exit
echo.

set /p CHOICE=Enter your choice (0-6): 

if "%CHOICE%"=="1" (
    if !SERVER_RUNNING!==1 (
        echo Server is already running.
        pause
        %0
        exit /b
    )
    start cmd /k "start-with-db.cmd"
    timeout /t 3 /nobreak > nul
    %0
    exit /b
)

if "%CHOICE%"=="2" (
    echo.
    echo What would you like to view?
    echo  a. All tables
    echo  b. Users
    echo  c. Buildings
    echo  d. Classrooms
    echo  e. Courses
    echo  f. Events
    echo.
    set /p SUBCHOICE=Enter your choice (a-f): 
    
    if "!SUBCHOICE!"=="a" (
        for %%t in (users buildings classrooms courses events) do (
            echo.
            echo TABLE: %%t
            echo ---------------------
            psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -c "SELECT * FROM %%t"
        )
    ) else if "!SUBCHOICE!"=="b" (
        psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -c "SELECT * FROM users"
    ) else if "!SUBCHOICE!"=="c" (
        psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -c "SELECT * FROM buildings"
    ) else if "!SUBCHOICE!"=="d" (
        psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -c "SELECT * FROM classrooms"
    ) else if "!SUBCHOICE!"=="e" (
        psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -c "SELECT * FROM courses"
    ) else if "!SUBCHOICE!"=="f" (
        psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -c "SELECT * FROM events"
    )
    
    pause
    %0
    exit /b
)

if "%CHOICE%"=="3" (
    call seed-database.cmd
    %0
    exit /b
)

if "%CHOICE%"=="4" (
    echo.
    echo WARNING: This will delete all data in the database.
    set /p CONFIRM=Are you sure you want to continue? (y/n): 
    
    if "!CONFIRM!"=="y" (
        echo Dropping all tables...
        psql -U %PGUSER% -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
        echo Running migrations to recreate tables...
        set DATABASE_URL=postgres://%PGUSER%:%PGPASSWORD%@%PGHOST%:%PGPORT%/%PGDATABASE%
        npx drizzle-kit push
    )
    
    pause
    %0
    exit /b
)

if "%CHOICE%"=="5" (
    echo Running database migrations...
    set DATABASE_URL=postgres://%PGUSER%:%PGPASSWORD%@%PGHOST%:%PGPORT%/%PGDATABASE%
    npx drizzle-kit push
    pause
    %0
    exit /b
)

if "%CHOICE%"=="6" (
    start http://localhost:5000
    %0
    exit /b
)

if "%CHOICE%"=="0" (
    exit /b
)

REM Invalid choice, restart
echo Invalid choice. Please try again.
timeout /t 2 /nobreak > nul
%0
