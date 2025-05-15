import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  avatarInitials: text("avatar_initials"),
  role: text("role").default("student"),
  studentId: text("student_id"),
  department: text("department"),
  semester: integer("semester"),
});

export const buildings = pgTable("buildings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name"),
  description: text("description"),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  type: text("type"), // e.g., "academic", "dining", "residence", etc.
  address: text("address"),
  campus: text("campus").default("PA College of Engineering, Konaje, Mangalore"),
});

export const studentLocations = pgTable("student_locations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  accuracy: real("accuracy"),
  timestamp: timestamp("timestamp").defaultNow(),
  isSharing: boolean("is_sharing").default(true),
  buildingId: integer("building_id").references(() => buildings.id),
});

export const classrooms = pgTable("classrooms", {
  id: serial("id").primaryKey(),
  buildingId: integer("building_id").notNull(),
  roomNumber: text("room_number").notNull(),
  floor: integer("floor"),
  capacity: integer("capacity"),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  courseCode: text("course_code").notNull(),
  instructor: text("instructor"),
  classroomId: integer("classroom_id").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  daysOfWeek: text("days_of_week").notNull(), // e.g., "Mon,Wed,Fri"
  description: text("description"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  buildingId: integer("building_id").notNull(),
  roomIdentifier: text("room_identifier"),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  description: text("description"),
  isPinned: boolean("is_pinned").default(false),
  createdBy: integer("created_by").notNull(), // userId
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  buildingId: integer("building_id"),
  classroomId: integer("classroom_id"),
  type: text("type").notNull(), // "building", "classroom", etc.
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  avatarInitials: true,
  role: true,
  studentId: true,
  department: true,
  semester: true,
});

export const insertBuildingSchema = createInsertSchema(buildings).pick({
  name: true,
  shortName: true,
  description: true,
  latitude: true,
  longitude: true,
  type: true,
  address: true,
  campus: true,
});

export const insertClassroomSchema = createInsertSchema(classrooms).pick({
  buildingId: true,
  roomNumber: true,
  floor: true,
  capacity: true,
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  name: true,
  courseCode: true,
  instructor: true,
  classroomId: true,
  startTime: true,
  endTime: true,
  daysOfWeek: true,
  description: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  buildingId: true,
  roomIdentifier: true,
  date: true,
  startTime: true,
  endTime: true,
  description: true,
  isPinned: true,
  createdBy: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  buildingId: true,
  classroomId: true,
  type: true,
});

export const insertStudentLocationSchema = createInsertSchema(studentLocations).pick({
  userId: true,
  latitude: true,
  longitude: true,
  accuracy: true,
  isSharing: true,
  buildingId: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Building = typeof buildings.$inferSelect;
export type InsertBuilding = z.infer<typeof insertBuildingSchema>;

export type Classroom = typeof classrooms.$inferSelect;
export type InsertClassroom = z.infer<typeof insertClassroomSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type StudentLocation = typeof studentLocations.$inferSelect;
export type InsertStudentLocation = z.infer<typeof insertStudentLocationSchema>;
