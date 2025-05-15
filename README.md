# PAHackWeb

## Overview

PAHackWeb is a campus management web application that helps students and staff navigate buildings, classrooms, and events.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)

### Database Setup

This application requires a PostgreSQL database. To connect to the database:

1. Install PostgreSQL if you haven't already
2. Run `setup-database.cmd` to create the database and run migrations
   - Edit the script to update your PostgreSQL credentials if needed
3. Alternatively, use `test-db-connection.cmd` to verify your PostgreSQL connection

For detailed database setup instructions, see `database/README.md`.

### Running the Application

1. Run `start-with-db.cmd` to start the application with database connection
2. Access the website at http://localhost:5000 in your browser

## Development

- Frontend: React, Vite, TailwindCSS
- Backend: Express.js
- Database: PostgreSQL with Drizzle ORM
