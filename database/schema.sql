-- This file is for reference only - the actual schema is defined in shared/schema.ts
-- and will be created using Drizzle ORM's migrations

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  display_name TEXT,
  avatar_initials TEXT,
  role TEXT DEFAULT 'student',
  student_id TEXT,
  department TEXT,
  semester INTEGER
);

-- Buildings Table
CREATE TABLE IF NOT EXISTS buildings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  description TEXT,
  latitude TEXT NOT NULL,
  longitude TEXT NOT NULL,
  type TEXT,
  address TEXT,
  campus TEXT DEFAULT 'PA College of Engineering, Konaje, Mangalore'
);

-- Student Locations Table
CREATE TABLE IF NOT EXISTS student_locations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  latitude TEXT NOT NULL,
  longitude TEXT NOT NULL,
  accuracy REAL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_sharing BOOLEAN DEFAULT TRUE,
  building_id INTEGER REFERENCES buildings(id)
);

-- Classrooms Table
CREATE TABLE IF NOT EXISTS classrooms (
  id SERIAL PRIMARY KEY,
  building_id INTEGER NOT NULL,
  room_number TEXT NOT NULL,
  floor INTEGER,
  capacity INTEGER
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  course_code TEXT NOT NULL
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  description TEXT,
  location TEXT,
  user_id INTEGER REFERENCES users(id)
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  reference_id INTEGER NOT NULL
);
