import { users, type User, type InsertUser } from "@shared/schema";
import { buildings, type Building, type InsertBuilding } from "@shared/schema";
import { classrooms, type Classroom, type InsertClassroom } from "@shared/schema";
import { courses, type Course, type InsertCourse } from "@shared/schema";
import { events, type Event, type InsertEvent } from "@shared/schema";
import { favorites, type Favorite, type InsertFavorite } from "@shared/schema";
import { studentLocations, type StudentLocation, type InsertStudentLocation } from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        role: insertUser.role || "student",
      })
      .returning();
    return user;
  }
  
  // Building operations
  async getAllBuildings(): Promise<Building[]> {
    return await db.select().from(buildings);
  }

  async getBuildingById(id: number): Promise<Building | undefined> {
    const [building] = await db.select().from(buildings).where(eq(buildings.id, id));
    return building || undefined;
  }

  async createBuilding(insertBuilding: InsertBuilding): Promise<Building> {
    const [building] = await db
      .insert(buildings)
      .values({
        ...insertBuilding,
        campus: insertBuilding.campus || "PA College of Engineering, Konaje, Mangalore",
      })
      .returning();
    return building;
  }
  
  // Classroom operations
  async getClassroomsByBuildingId(buildingId: number): Promise<Classroom[]> {
    return await db.select().from(classrooms).where(eq(classrooms.buildingId, buildingId));
  }

  async getClassroomById(id: number): Promise<Classroom | undefined> {
    const [classroom] = await db.select().from(classrooms).where(eq(classrooms.id, id));
    return classroom || undefined;
  }

  async createClassroom(insertClassroom: InsertClassroom): Promise<Classroom> {
    const [classroom] = await db
      .insert(classrooms)
      .values(insertClassroom)
      .returning();
    return classroom;
  }
  
  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getCoursesByUserId(userId: number): Promise<Course[]> {
    // For simplicity, we'll return all courses for now, since we don't have a user-course relationship table yet
    return await db.select().from(courses);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values(insertCourse)
      .returning();
    return course;
  }
  
  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getEventsByUserId(userId: number): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.createdBy, userId));
  }

  async getEventsByDate(date: string): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.date, date));
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  async updateEvent(id: number, eventUpdate: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updated] = await db
      .update(events)
      .set(eventUpdate)
      .where(eq(events.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning();
    return !!deleted;
  }
  
  // Favorite operations
  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values(insertFavorite)
      .returning();
    return favorite;
  }

  async deleteFavorite(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(favorites)
      .where(eq(favorites.id, id))
      .returning();
    return !!deleted;
  }

  // Student location operations
  async getStudentLocation(userId: number): Promise<StudentLocation | undefined> {
    const [location] = await db
      .select()
      .from(studentLocations)
      .where(eq(studentLocations.userId, userId))
      .orderBy(studentLocations.timestamp)
      .limit(1);
    return location || undefined;
  }

  async createStudentLocation(insertLocation: InsertStudentLocation): Promise<StudentLocation> {
    const [location] = await db
      .insert(studentLocations)
      .values(insertLocation)
      .returning();
    return location;
  }

  async updateStudentLocation(userId: number, locationUpdate: Partial<InsertStudentLocation>): Promise<StudentLocation | undefined> {
    // Delete old locations to avoid clutter
    await db
      .delete(studentLocations)
      .where(eq(studentLocations.userId, userId));
    
    // Create a new location
    const [updated] = await db
      .insert(studentLocations)
      .values({
        userId,
        ...locationUpdate,
      })
      .returning();
    return updated || undefined;
  }

  async getStudentsSharingLocation(): Promise<StudentLocation[]> {
    return await db
      .select()
      .from(studentLocations)
      .where(eq(studentLocations.isSharing, true));
  }

  async setLocationSharing(userId: number, isSharing: boolean): Promise<boolean> {
    const [updated] = await db
      .update(studentLocations)
      .set({ isSharing })
      .where(eq(studentLocations.userId, userId))
      .returning();
    return !!updated;
  }
}