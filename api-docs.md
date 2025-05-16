# API Documentation

This document provides details about the available API endpoints for the PAHackWeb application.

## Base URL

All endpoints are relative to: `http://localhost:5000/api`

## Authentication

Currently, the API does not implement authentication. This may be added in future updates.

## Available Endpoints

### Buildings

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | `/buildings`     | Get all buildings     |
| GET    | `/buildings/:id` | Get a building by ID  |
| POST   | `/buildings`     | Create a new building |

#### Example Response - GET `/buildings`

```json
[
  {
    "id": 1,
    "name": "Main Academic Building",
    "shortName": "MAB",
    "description": "Primary academic facilities and administration offices",
    "latitude": "12.874213",
    "longitude": "74.843664",
    "type": "academic",
    "address": "College Road, Konaje",
    "campus": "PA College of Engineering, Konaje, Mangalore"
  }
  // More buildings...
]
```

### Classrooms

| Method | Endpoint                            | Description                      |
| ------ | ----------------------------------- | -------------------------------- |
| GET    | `/buildings/:buildingId/classrooms` | Get all classrooms in a building |
| GET    | `/classrooms/:id`                   | Get a classroom by ID            |
| POST   | `/classrooms`                       | Create a new classroom           |

#### Example Response - GET `/buildings/1/classrooms`

```json
[
  {
    "id": 1,
    "buildingId": 1,
    "roomNumber": "101",
    "floor": 1,
    "capacity": 60
  }
  // More classrooms...
]
```

### Courses

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | `/courses`               | Get all courses            |
| GET    | `/courses/:id`           | Get a course by ID         |
| GET    | `/users/:userId/courses` | Get all courses for a user |
| POST   | `/courses`               | Create a new course        |

#### Example Response - GET `/courses`

```json
[
  {
    "id": 1,
    "name": "Introduction to Computer Science",
    "courseCode": "CS101",
    "instructor": "Dr. Johnson",
    "classroomId": 5,
    "startTime": "09:00",
    "endTime": "10:30",
    "daysOfWeek": "Mon,Wed,Fri",
    "description": "Fundamentals of CS"
  }
  // More courses...
]
```

### Events

| Method | Endpoint                | Description                       |
| ------ | ----------------------- | --------------------------------- |
| GET    | `/events`               | Get all events                    |
| GET    | `/events/:id`           | Get an event by ID                |
| GET    | `/users/:userId/events` | Get all events for a user         |
| GET    | `/events/date/:date`    | Get all events on a specific date |
| POST   | `/events`               | Create a new event                |
| PUT    | `/events/:id`           | Update an event                   |
| DELETE | `/events/:id`           | Delete an event                   |

#### Example Response - GET `/events`

```json
[
  {
    "id": 1,
    "title": "Tech Seminar",
    "buildingId": 1,
    "roomIdentifier": "Auditorium",
    "date": "2025-05-16",
    "startTime": "10:00",
    "endTime": "12:00",
    "description": "Latest trends in technology",
    "isPinned": false,
    "createdBy": 1
  }
  // More events...
]
```

### Users

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| GET    | `/users/:id` | Get a user by ID  |
| POST   | `/users`     | Create a new user |

#### Example Response - GET `/users/1`

```json
{
  "id": 1,
  "username": "admin",
  "displayName": "Administrator",
  "role": "admin",
  "department": "Administration"
}
```

### Favorites

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| GET    | `/users/:userId/favorites` | Get all favorites for a user |
| POST   | `/favorites`               | Create a new favorite        |
| DELETE | `/favorites/:id`           | Delete a favorite            |

#### Example Response - GET `/users/1/favorites`

```json
[
  {
    "id": 1,
    "userId": 1,
    "buildingId": 2,
    "type": "building"
  }
  // More favorites...
]
```

### Student Locations

| Method | Endpoint                  | Description                             |
| ------ | ------------------------- | --------------------------------------- |
| GET    | `/users/:userId/location` | Get a student's location                |
| GET    | `/locations/sharing`      | Get all students sharing their location |
| POST   | `/locations`              | Create a new student location           |
| PUT    | `/users/:userId/location` | Update a student's location             |

#### Example Response - GET `/users/2/location`

```json
{
  "id": 1,
  "userId": 2,
  "latitude": "12.875123",
  "longitude": "74.842345",
  "accuracy": 10.5,
  "timestamp": "2025-05-15T12:30:45Z",
  "isSharing": true,
  "buildingId": 1
}
```

## Status Codes

The API returns the following status codes:

| Code | Description  |
| ---- | ------------ |
| 200  | Success      |
| 201  | Created      |
| 400  | Bad Request  |
| 404  | Not Found    |
| 500  | Server Error |

## Testing the API

You can use tools like Postman, cURL, or even your browser to test GET endpoints. For POST, PUT, and DELETE operations, you'll need to use a tool that can send the appropriate HTTP methods with JSON bodies.
