import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBuildingSchema, 
  insertClassroomSchema, 
  insertCourseSchema, 
  insertEventSchema, 
  insertFavoriteSchema, 
  insertUserSchema,
  insertStudentLocationSchema
} from "@shared/schema";
import { ZodError } from "zod";

// Common function to handle zod validation errors
function handleZodError(err: unknown, res: Response) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors
    });
  }
  return res.status(500).json({ message: "Internal server error" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  
  // Buildings
  apiRouter.get("/buildings", async (req: Request, res: Response) => {
    try {
      const buildings = await storage.getAllBuildings();
      res.json(buildings);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve buildings" });
    }
  });
  
  apiRouter.get("/buildings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const building = await storage.getBuildingById(id);
      
      if (!building) {
        return res.status(404).json({ message: "Building not found" });
      }
      
      res.json(building);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve building" });
    }
  });
  
  apiRouter.post("/buildings", async (req: Request, res: Response) => {
    try {
      const buildingData = insertBuildingSchema.parse(req.body);
      const newBuilding = await storage.createBuilding(buildingData);
      res.status(201).json(newBuilding);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Classrooms
  apiRouter.get("/buildings/:buildingId/classrooms", async (req: Request, res: Response) => {
    try {
      const buildingId = parseInt(req.params.buildingId);
      const classrooms = await storage.getClassroomsByBuildingId(buildingId);
      res.json(classrooms);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve classrooms" });
    }
  });
  
  apiRouter.get("/classrooms/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const classroom = await storage.getClassroomById(id);
      
      if (!classroom) {
        return res.status(404).json({ message: "Classroom not found" });
      }
      
      res.json(classroom);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve classroom" });
    }
  });
  
  apiRouter.post("/classrooms", async (req: Request, res: Response) => {
    try {
      const classroomData = insertClassroomSchema.parse(req.body);
      const newClassroom = await storage.createClassroom(classroomData);
      res.status(201).json(newClassroom);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Courses
  apiRouter.get("/courses", async (req: Request, res: Response) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve courses" });
    }
  });
  
  apiRouter.get("/courses/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourseById(id);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve course" });
    }
  });
  
  apiRouter.get("/users/:userId/courses", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const courses = await storage.getCoursesByUserId(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user courses" });
    }
  });
  
  apiRouter.post("/courses", async (req: Request, res: Response) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const newCourse = await storage.createCourse(courseData);
      res.status(201).json(newCourse);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Events
  apiRouter.get("/events", async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string;
      
      let events;
      if (date) {
        events = await storage.getEventsByDate(date);
      } else {
        events = await storage.getAllEvents();
      }
      
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve events" });
    }
  });
  
  apiRouter.get("/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve event" });
    }
  });
  
  apiRouter.get("/users/:userId/events", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const events = await storage.getEventsByUserId(userId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user events" });
    }
  });
  
  apiRouter.post("/events", async (req: Request, res: Response) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(eventData);
      res.status(201).json(newEvent);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  apiRouter.patch("/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const eventUpdate = req.body;
      
      const updatedEvent = await storage.updateEvent(id, eventUpdate);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update event" });
    }
  });
  
  apiRouter.delete("/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEvent(id);
      
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });
  
  // Favorites
  apiRouter.get("/users/:userId/favorites", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getFavoritesByUserId(userId);
      
      // Enrich with building data
      const enrichedFavorites = await Promise.all(
        favorites.map(async (favorite) => {
          if (favorite.buildingId) {
            const building = await storage.getBuildingById(favorite.buildingId);
            return { ...favorite, building };
          }
          return favorite;
        })
      );
      
      res.json(enrichedFavorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve favorites" });
    }
  });
  
  apiRouter.post("/favorites", async (req: Request, res: Response) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const newFavorite = await storage.createFavorite(favoriteData);
      res.status(201).json(newFavorite);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  apiRouter.delete("/favorites/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteFavorite(id);
      
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete favorite" });
    }
  });
  
  // Auth - simple for demo
  apiRouter.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const userWithoutPassword = { ...user };
      delete (userWithoutPassword as any).password;
      
      res.json({
        user: userWithoutPassword,
        message: "Login successful"
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Register
  apiRouter.post("/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username is already taken
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username is already taken" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Don't return the password
      const userWithoutPassword = { ...newUser };
      delete (userWithoutPassword as any).password;
      
      res.status(201).json({
        user: userWithoutPassword,
        message: "User registered successfully"
      });
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Student Location routes
  apiRouter.get("/users/:userId/location", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const location = await storage.getStudentLocation(userId);
      
      if (!location) {
        return res.status(404).json({ message: "Location not found for this user" });
      }
      
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve student location" });
    }
  });
  
  apiRouter.post("/users/:userId/location", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const locationData = insertStudentLocationSchema.parse({
        ...req.body,
        userId
      });
      
      const newLocation = await storage.createStudentLocation(locationData);
      res.status(201).json(newLocation);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  apiRouter.put("/users/:userId/location", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const locationUpdate = req.body;
      
      const updatedLocation = await storage.updateStudentLocation(userId, {
        ...locationUpdate,
        userId
      });
      
      if (!updatedLocation) {
        return res.status(404).json({ message: "Failed to update location" });
      }
      
      res.json(updatedLocation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update student location" });
    }
  });
  
  apiRouter.get("/student-locations", async (req: Request, res: Response) => {
    try {
      const locations = await storage.getStudentsSharingLocation();
      
      // Enrich with user data
      const enrichedLocations = await Promise.all(
        locations.map(async (location) => {
          const user = await storage.getUser(location.userId);
          return { 
            ...location, 
            user: user ? {
              id: user.id,
              displayName: user.displayName,
              avatarInitials: user.avatarInitials,
              role: user.role,
              studentId: user.studentId,
              department: user.department
            } : null
          };
        })
      );
      
      res.json(enrichedLocations);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve student locations" });
    }
  });
  
  apiRouter.patch("/users/:userId/location/sharing", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const { isSharing } = req.body;
      
      if (typeof isSharing !== 'boolean') {
        return res.status(400).json({ message: "isSharing must be a boolean" });
      }
      
      const success = await storage.setLocationSharing(userId, isSharing);
      
      if (!success) {
        return res.status(404).json({ message: "No location found for this user" });
      }
      
      res.json({ success: true, isSharing });
    } catch (error) {
      res.status(500).json({ message: "Failed to update location sharing settings" });
    }
  });

  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
