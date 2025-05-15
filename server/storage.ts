import { 
  users, type User, type InsertUser,
  buildings, type Building, type InsertBuilding,
  classrooms, type Classroom, type InsertClassroom,
  courses, type Course, type InsertCourse,
  events, type Event, type InsertEvent,
  favorites, type Favorite, type InsertFavorite,
  studentLocations, type StudentLocation, type InsertStudentLocation
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Building operations
  getAllBuildings(): Promise<Building[]>;
  getBuildingById(id: number): Promise<Building | undefined>;
  createBuilding(building: InsertBuilding): Promise<Building>;
  
  // Classroom operations
  getClassroomsByBuildingId(buildingId: number): Promise<Classroom[]>;
  getClassroomById(id: number): Promise<Classroom | undefined>;
  createClassroom(classroom: InsertClassroom): Promise<Classroom>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  getCoursesByUserId(userId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Event operations
  getAllEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  getEventsByUserId(userId: number): Promise<Event[]>;
  getEventsByDate(date: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Favorite operations
  getFavoritesByUserId(userId: number): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<boolean>;

  // Student location operations
  getStudentLocation(userId: number): Promise<StudentLocation | undefined>;
  createStudentLocation(location: InsertStudentLocation): Promise<StudentLocation>;
  updateStudentLocation(userId: number, location: Partial<InsertStudentLocation>): Promise<StudentLocation | undefined>;
  getStudentsSharingLocation(): Promise<StudentLocation[]>;
  setLocationSharing(userId: number, isSharing: boolean): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private buildings: Map<number, Building>;
  private classrooms: Map<number, Classroom>;
  private courses: Map<number, Course>;
  private events: Map<number, Event>;
  private favorites: Map<number, Favorite>;
  private studentLocations: Map<number, StudentLocation>;
  
  private userCurrentId: number;
  private buildingCurrentId: number;
  private classroomCurrentId: number;
  private courseCurrentId: number;
  private eventCurrentId: number;
  private favoriteCurrentId: number;
  private studentLocationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.buildings = new Map();
    this.classrooms = new Map();
    this.courses = new Map();
    this.events = new Map();
    this.favorites = new Map();
    this.studentLocations = new Map();
    
    this.userCurrentId = 1;
    this.buildingCurrentId = 1;
    this.classroomCurrentId = 1;
    this.courseCurrentId = 1;
    this.eventCurrentId = 1;
    this.favoriteCurrentId = 1;
    this.studentLocationCurrentId = 1;
    
    // Seed data
    this.seedData();
  }

  private seedData() {
    // Seed buildings
    const buildingData: InsertBuilding[] = [
      {
        name: "Science Building",
        shortName: "SCI",
        description: "Main science building with laboratories and lecture halls",
        latitude: "34.0689",
        longitude: "-118.4452",
        type: "academic",
        address: "123 Science Way"
      },
      {
        name: "Humanities Center",
        shortName: "HUM",
        description: "Home to the languages, arts, and literature departments",
        latitude: "34.0702",
        longitude: "-118.4431",
        type: "academic",
        address: "456 Humanities Lane"
      },
      {
        name: "Technology Center",
        shortName: "TECH",
        description: "Computer labs and technology classrooms",
        latitude: "34.0715",
        longitude: "-118.4420",
        type: "academic",
        address: "789 Tech Avenue"
      },
      {
        name: "Student Center",
        shortName: "STU",
        description: "Student services, dining, and recreation",
        latitude: "34.0670",
        longitude: "-118.4460",
        type: "services",
        address: "321 Student Way"
      },
      {
        name: "Library",
        shortName: "LIB",
        description: "Main campus library with study spaces",
        latitude: "34.0680",
        longitude: "-118.4445",
        type: "academic",
        address: "654 Library Road"
      }
    ];
    
    buildingData.forEach(building => {
      this.createBuilding(building);
    });

    // Seed classrooms
    const classroomData: InsertClassroom[] = [
      { buildingId: 1, roomNumber: "302", floor: 3, capacity: 60 },
      { buildingId: 1, roomNumber: "201", floor: 2, capacity: 45 },
      { buildingId: 2, roomNumber: "105", floor: 1, capacity: 35 },
      { buildingId: 3, roomNumber: "201", floor: 2, capacity: 30 },
      { buildingId: 4, roomNumber: "B12", floor: -1, capacity: 25 }
    ];
    
    classroomData.forEach(classroom => {
      this.createClassroom(classroom);
    });

    // Seed courses
    const courseData: InsertCourse[] = [
      {
        name: "Biology 101",
        courseCode: "BIO101",
        instructor: "Dr. Johnson",
        classroomId: 1,
        startTime: "10:00",
        endTime: "11:20",
        daysOfWeek: "Mon,Wed,Fri",
        description: "Introduction to biological concepts"
      },
      {
        name: "English Literature",
        courseCode: "ENG210",
        instructor: "Dr. James Williams",
        classroomId: 3,
        startTime: "12:30",
        endTime: "13:50",
        daysOfWeek: "Tue,Thu",
        description: "Survey of English literature"
      },
      {
        name: "Computer Science",
        courseCode: "CS150",
        instructor: "Prof. Sarah Chen",
        classroomId: 4,
        startTime: "14:15",
        endTime: "15:35",
        daysOfWeek: "Mon,Wed",
        description: "Introduction to programming concepts"
      }
    ];
    
    courseData.forEach(course => {
      this.createCourse(course);
    });

    // Create demo user
    this.createUser({
      username: "student",
      password: "password",
      displayName: "John Student",
      avatarInitials: "JS"
    });

    // Seed events
    const eventData: InsertEvent[] = [
      {
        title: "Student Club Meeting",
        buildingId: 4,
        roomIdentifier: "B12",
        date: "2023-10-05",
        startTime: "16:30",
        endTime: "17:30",
        description: "Programming Club weekly meeting",
        isPinned: true,
        createdBy: 1
      },
      {
        title: "Campus Tour (Volunteer)",
        buildingId: 5,
        roomIdentifier: "Main Entrance",
        date: "2023-10-06",
        startTime: "09:00",
        endTime: "10:30",
        description: "Volunteer for campus tour guides",
        isPinned: false,
        createdBy: 1
      },
      {
        title: "Career Fair",
        buildingId: 4,
        roomIdentifier: "Grand Hall",
        date: "2023-10-07",
        startTime: "13:00",
        endTime: "16:00",
        description: "30+ companies attending. Bring your resume!",
        isPinned: false,
        createdBy: 1
      }
    ];
    
    eventData.forEach(event => {
      this.createEvent(event);
    });

    // Seed favorites
    const favoriteData: InsertFavorite[] = [
      { userId: 1, buildingId: 5, type: "building" },
      { userId: 1, buildingId: 1, type: "building" },
      { userId: 1, buildingId: 4, type: "building" }
    ];
    
    favoriteData.forEach(favorite => {
      this.createFavorite(favorite);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Building operations
  async getAllBuildings(): Promise<Building[]> {
    return Array.from(this.buildings.values());
  }
  
  async getBuildingById(id: number): Promise<Building | undefined> {
    return this.buildings.get(id);
  }
  
  async createBuilding(insertBuilding: InsertBuilding): Promise<Building> {
    const id = this.buildingCurrentId++;
    const building: Building = { ...insertBuilding, id };
    this.buildings.set(id, building);
    return building;
  }
  
  // Classroom operations
  async getClassroomsByBuildingId(buildingId: number): Promise<Classroom[]> {
    return Array.from(this.classrooms.values()).filter(
      (classroom) => classroom.buildingId === buildingId
    );
  }
  
  async getClassroomById(id: number): Promise<Classroom | undefined> {
    return this.classrooms.get(id);
  }
  
  async createClassroom(insertClassroom: InsertClassroom): Promise<Classroom> {
    const id = this.classroomCurrentId++;
    const classroom: Classroom = { ...insertClassroom, id };
    this.classrooms.set(id, classroom);
    return classroom;
  }
  
  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourseById(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async getCoursesByUserId(userId: number): Promise<Course[]> {
    // For simplicity, return all courses for any user (no enrollment relationship in this demo)
    return this.getAllCourses();
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseCurrentId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }
  
  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async getEventsByUserId(userId: number): Promise<Event[]> {
    // For simplicity, return all events created by the user
    return Array.from(this.events.values()).filter(
      (event) => event.createdBy === userId
    );
  }
  
  async getEventsByDate(date: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.date === date
    );
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventCurrentId++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }
  
  async updateEvent(id: number, eventUpdate: Partial<InsertEvent>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent = { ...existingEvent, ...eventUpdate };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }
  
  // Favorite operations
  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      (favorite) => favorite.userId === userId
    );
  }
  
  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteCurrentId++;
    const favorite: Favorite = { ...insertFavorite, id };
    this.favorites.set(id, favorite);
    return favorite;
  }
  
  async deleteFavorite(id: number): Promise<boolean> {
    return this.favorites.delete(id);
  }
  
  // Student location operations
  async getStudentLocation(userId: number): Promise<StudentLocation | undefined> {
    return Array.from(this.studentLocations.values())
      .filter(location => location.userId === userId)
      .sort((a, b) => {
        // Sort by most recent timestamp if available
        if (a.timestamp && b.timestamp) {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        return 0;
      })[0];
  }

  async createStudentLocation(insertLocation: InsertStudentLocation): Promise<StudentLocation> {
    const id = this.studentLocationCurrentId++;
    const location: StudentLocation = { 
      ...insertLocation, 
      id,
      timestamp: new Date().toISOString(),
      isSharing: insertLocation.isSharing ?? true
    };
    this.studentLocations.set(id, location);
    return location;
  }

  async updateStudentLocation(userId: number, locationUpdate: Partial<InsertStudentLocation>): Promise<StudentLocation | undefined> {
    // Find all locations for this user
    const userLocations = Array.from(this.studentLocations.values())
      .filter(location => location.userId === userId);
    
    // Delete old locations to avoid clutter
    userLocations.forEach(location => {
      this.studentLocations.delete(location.id);
    });
    
    // Create a new location with updated values
    const id = this.studentLocationCurrentId++;
    const location: StudentLocation = {
      userId,
      id,
      latitude: locationUpdate.latitude || "0",
      longitude: locationUpdate.longitude || "0",
      accuracy: locationUpdate.accuracy || null,
      timestamp: new Date().toISOString(),
      isSharing: locationUpdate.isSharing ?? true,
      buildingId: locationUpdate.buildingId || null
    };
    
    this.studentLocations.set(id, location);
    return location;
  }

  async getStudentsSharingLocation(): Promise<StudentLocation[]> {
    return Array.from(this.studentLocations.values())
      .filter(location => location.isSharing);
  }

  async setLocationSharing(userId: number, isSharing: boolean): Promise<boolean> {
    const userLocations = Array.from(this.studentLocations.values())
      .filter(location => location.userId === userId);
    
    if (userLocations.length === 0) {
      return false;
    }
    
    // Update all locations for this user
    userLocations.forEach(location => {
      const updatedLocation = { ...location, isSharing };
      this.studentLocations.set(location.id, updatedLocation);
    });
    
    return true;
  }
}

export const storage = new MemStorage();
