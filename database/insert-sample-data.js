const { Pool } = require("pg");

// Database connection details - make sure these match your setup-database.cmd
const config = {
  user: "postgres",
  password: "rafan", // using the password from your setup-database.cmd
  host: "localhost",
  port: 5432,
  database: "hackpace", // using the database name from your setup-database.cmd
};

const pool = new Pool(config);

async function insertSampleData() {
  try {
    console.log("Starting to insert sample data...");

    // Insert users
    console.log("Inserting users...");
    await pool.query(`
      INSERT INTO users (username, password, display_name, role, student_id, department, semester)
      VALUES 
        ('admin', 'admin123', 'Administrator', 'admin', NULL, 'Administration', NULL),
        ('student1', 'student123', 'John Student', 'student', 'ST12345', 'Computer Science', 4),
        ('student2', 'student123', 'Jane Student', 'student', 'ST67890', 'Electronics', 2),
        ('faculty1', 'faculty123', 'Dr. Smith', 'faculty', NULL, 'Computer Science', NULL)
      ON CONFLICT (username) DO NOTHING;
    `);

    // Insert buildings
    console.log("Inserting buildings...");
    await pool.query(`
      INSERT INTO buildings (name, short_name, description, latitude, longitude, type, address)
      VALUES 
        ('Main Academic Building', 'MAB', 'Primary academic facilities and administration offices', '12.874213', '74.843664', 'academic', 'College Road, Konaje'),
        ('Computer Science Block', 'CSB', 'Houses the Computer Science and IT departments', '12.875321', '74.842953', 'academic', 'College Road, Konaje'),
        ('Library', 'LIB', 'Central library with study areas', '12.873890', '74.844210', 'academic', 'College Road, Konaje'),
        ('Cafeteria', 'CAF', 'Student dining facilities', '12.872345', '74.843975', 'dining', 'College Road, Konaje')
      ON CONFLICT DO NOTHING;
    `);

    // Insert classrooms
    console.log("Inserting classrooms...");
    await pool.query(`
      INSERT INTO classrooms (building_id, room_number, floor, capacity)
      VALUES 
        (1, '101', 1, 60),
        (1, '102', 1, 40),
        (1, '201', 2, 60),
        (1, '202', 2, 40),
        (2, 'CS101', 1, 50),
        (2, 'CS102', 1, 30),
        (2, 'CS201', 2, 40),
        (2, 'Lab1', 1, 25)
      ON CONFLICT DO NOTHING;
    `);

    // Insert courses
    console.log("Inserting courses...");
    await pool.query(`
      INSERT INTO courses (name, course_code)
      VALUES 
        ('Introduction to Computer Science', 'CS101'),
        ('Data Structures and Algorithms', 'CS201'),
        ('Database Systems', 'CS301'),
        ('Web Development', 'CS401'),
        ('Digital Electronics', 'EE201'),
        ('Calculus I', 'MA101')
      ON CONFLICT DO NOTHING;
    `);

    // Insert events
    console.log("Inserting events...");
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await pool.query(
      `
      INSERT INTO events (title, start_time, end_time, description, location, user_id)
      VALUES 
        ('Tech Seminar', $1, $2, 'Latest trends in technology', 'Auditorium', 1),
        ('Coding Competition', $3, $4, 'Annual coding challenge', 'CS Lab', 1),
        ('Career Fair', $5, $6, 'Meet potential employers', 'Main Hall', 1)
      ON CONFLICT DO NOTHING;
    `,
      [
        new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString(),
        new Date(tomorrow.setHours(12, 0, 0, 0.0)).toISOString(),
        new Date(nextWeek.setHours(9, 0, 0, 0)).toISOString(),
        new Date(nextWeek.setHours(17, 0, 0, 0)).toISOString(),
        new Date(nextWeek.setDate(nextWeek.getDate() + 3)).toISOString(),
        new Date(nextWeek.setHours(16, 0, 0, 0)).toISOString(),
      ]
    );

    console.log("All sample data inserted successfully!");
  } catch (err) {
    console.error("Error inserting sample data:", err);
  } finally {
    await pool.end();
  }
}

insertSampleData();
