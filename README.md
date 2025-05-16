# PA College of Engineering - Interactive Campus Map

## Overview

This interactive campus map application helps students, staff, and visitors navigate the PA College of Engineering campus with detailed information about buildings, classrooms, courses, and events.

## Features

- Interactive campus map with custom building markers
- Building search functionality
- Detailed building information with classrooms and events
- Navigation assistance with distance and walking time estimates
- User location tracking
- Personalized schedule and event tracking
- Mobile-responsive design
- Native mobile app for iOS and Android
- Offline map capabilities in the mobile app

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)

### Quick Start

1. Run the `start-app.cmd` script:
   ```
   start-app.cmd
   ```

This script will set up the database, create tables, seed sample data, and start the application in one go.

### Manual Database Setup

To set up the database components separately:

1. Install PostgreSQL if you haven't already
2. Run `setup-database.cmd` to create the database and run migrations
   - Edit the script to update your PostgreSQL credentials if needed
3. Run `test-db-connection.cmd` to verify your PostgreSQL connection
4. Run `seed-database.cmd` to populate the database with sample data

For detailed database setup instructions, see `database/README.md`.

### Running the Application

1. Run `start-with-db.cmd` to start the application with database connection
2. Access the website at http://localhost:5000 in your browser

## Development

- Frontend: React, Vite, TailwindCSS, Leaflet Maps
- Backend: Express.js
- Database: PostgreSQL with Drizzle ORM
- UI Components: Shadcn UI

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend API server
- `/database` - Database schema and scripts
- `/shared` - Shared types and utilities
- `/mobile` - React Native mobile application

## Development Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the application
- `npm run lint` - Run linting checks

## Mobile Application

The project includes a native mobile application built with React Native and Expo:

### Features

- Native mobile experience for iOS and Android
- Interactive campus map using React Native Maps
- Building details and navigation
- Schedule viewing and management
- Distance calculator between campus buildings
- Settings for customizing the app experience

### Running the Mobile App

1. Navigate to the mobile directory: `cd mobile`
2. Install dependencies: `npm install`
3. Start the Expo development server: `npm start`
4. Follow the on-screen instructions to run on a simulator or physical device

For detailed instructions, see `mobile/README.md`.

## License

All rights reserved. This project is property of PA College of Engineering.
