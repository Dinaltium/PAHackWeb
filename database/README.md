# PostgreSQL Database Setup Guide

This guide will help you connect the PAHackWeb application to a PostgreSQL database.

## Prerequisites

1. **Install PostgreSQL**:

   - Download and install PostgreSQL from [PostgreSQL official website](https://www.postgresql.org/download/)
   - During installation, remember the password you set for the `postgres` user

2. **Verify PostgreSQL Installation**:
   - Open a command prompt and run:
   ```
   psql --version
   ```
   - If installed correctly, you should see version information

## Setting Up the Database

### Option 1: Using the Setup Script

1. Open the `setup-database.cmd` file in a text editor
2. Update the PostgreSQL connection details:
   ```
   set PGUSER=postgres        (replace with your PostgreSQL username)
   set PGPASSWORD=password    (replace with your PostgreSQL password)
   set PGHOST=localhost       (replace with your PostgreSQL host if not local)
   set PGPORT=5432            (replace with your PostgreSQL port if different)
   set PGDATABASE=pahackweb   (change the database name if desired)
   ```
3. Save the file and run `setup-database.cmd` by double-clicking it

### Option 2: Manual Setup

1. Open a command prompt and connect to PostgreSQL:
   ```
   psql -U postgres
   ```
2. Create a new database:
   ```sql
   CREATE DATABASE pahackweb;
   ```
3. Exit PostgreSQL:
   ```
   \q
   ```
4. Run database migrations:
   ```
   set DATABASE_URL=postgres://postgres:password@localhost:5432/pahackweb
   npx drizzle-kit push
   ```
   (Replace the connection details with your actual values)

## Running the Application with Database Connection

1. Open the `start-with-db.cmd` file in a text editor
2. Update the PostgreSQL connection details to match your setup (same as in step 2 of Option 1)
3. Save the file and run `start-with-db.cmd` by double-clicking it

## Troubleshooting

- **Connection Issues**: Ensure PostgreSQL is running and the connection details are correct
- **Migration Errors**: Check for any error messages when running `drizzle-kit push`
- **Missing Tables**: Verify that all tables were created by connecting to the database:
  ```
  psql -U postgres -d pahackweb
  \dt
  ```
- **Environment Variables**: If issues persist, ensure the `DATABASE_URL` environment variable is correctly set

## Database Schema

The database schema is defined in `shared/schema.ts` and includes the following tables:

- users
- buildings
- classrooms
- courses
- events
- favorites
- student_locations

For a reference SQL schema, see `database/schema.sql`.
