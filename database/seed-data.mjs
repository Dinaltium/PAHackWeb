import pg from "pg";
const { Pool } = pg;

// Database connection details - using environment variables if available
const config = {
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "rafan",
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || "hackpace",
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
    `); // Insert buildings
    console.log("Inserting buildings...");
    await pool.query(`
      INSERT INTO buildings (name, short_name, description, latitude, longitude, type, address)
      VALUES 
        ('Main Academic Building', 'MAB', 'Primary academic facilities and administration offices', '12.806763', '74.932512', 'academic', 'PA College of Engineering, Mangalore'),
        ('Computer Science Block', 'CSB', 'Houses the Computer Science and IT departments', '12.807212', '74.933115', 'academic', 'PA College of Engineering, Mangalore'),
        ('Engineering Block', 'ENG', 'Mechanical and Civil Engineering departments', '12.807635', '74.932956', 'academic', 'PA College of Engineering, Mangalore'),
        ('Administrative Block', 'ADM', 'College administration and offices', '12.806512', '74.933215', 'administrative', 'PA College of Engineering, Mangalore'),
        ('Central Library', 'LIB', 'Main library with study spaces and digital resources', '12.806626', '74.932975', 'library', 'PA College of Engineering, Mangalore'),
        ('Pace Workshop', 'WKS', 'Practical training and project development space', '12.806595', '74.931562', 'academic', 'PA College of Engineering, Mangalore'),
        ('Parking Area', 'PRK', 'Main student and staff parking', '12.806382', '74.931941', 'facility', 'PA College of Engineering, Mangalore'),
        ('College ATM', 'ATM', '24-hour ATM service', '12.806604', '74.932382', 'facility', 'PA College of Engineering, Mangalore'),
        ('PACE Auditorium', 'AUD', 'Main event and conference venue', '12.807693', '74.932382', 'administrative', 'PA College of Engineering, Mangalore'),
        ('PACE Masjid', 'MSJ', 'Campus prayer facility', '12.808634', '74.933624', 'facility', 'PA College of Engineering, Mangalore'),        ('PACE Pharmacy', 'PHR', 'Campus medical supplies and pharmacy', '12.808499', '74.932380', 'facility', 'PA College of Engineering, Mangalore'),
        ('Boys Hostel', 'BHT', 'Male student accommodation', '12.809797', '74.933485', 'residence', 'PA College of Engineering, Mangalore'),
        ('Ikkus Shop', 'IKS', 'Campus convenience store and snacks', '12.809679', '74.933582', 'dining', 'PA College of Engineering, Mangalore'),
        ('Cafeteria', 'CAF', 'Student dining facilities', '12.805987', '74.932789', 'dining', 'PA College of Engineering, Mangalore'),
        ('Sports Complex', 'SPT', 'Athletic facilities and grounds', '12.805423', '74.931570', 'recreation', 'PA College of Engineering, Mangalore')
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
      INSERT INTO courses (name, course_code, instructor, classroom_id, start_time, end_time, days_of_week, description)
      VALUES 
        ('Introduction to Computer Science', 'CS101', 'Dr. Johnson', 5, '09:00', '10:30', 'Mon,Wed,Fri', 'Fundamentals of CS'),
        ('Data Structures and Algorithms', 'CS201', 'Prof. Williams', 6, '11:00', '12:30', 'Tue,Thu', 'Advanced algorithms'),
        ('Database Systems', 'CS301', 'Dr. Garcia', 7, '14:00', '15:30', 'Mon,Wed', 'SQL and database design'),
        ('Web Development', 'CS401', 'Prof. Miller', 8, '16:00', '17:30', 'Tue,Thu', 'Full-stack development'),
        ('Digital Electronics', 'EE201', 'Dr. Chen', 1, '10:00', '11:30', 'Wed,Fri', 'Circuit design fundamentals'),
        ('Calculus I', 'MA101', 'Prof. Taylor', 2, '13:00', '14:30', 'Mon,Wed,Fri', 'Introduction to calculus')
      ON CONFLICT DO NOTHING;
    `);

    // Insert events
    console.log("Inserting events...");
    const now = new Date();
    const tomorrowDate = now.toISOString().slice(0, 10); // YYYY-MM-DD

    // Add days to get next week's date
    const nextWeekDate = new Date(now);
    nextWeekDate.setDate(now.getDate() + 7);
    const nextWeekStr = nextWeekDate.toISOString().slice(0, 10);

    await pool.query(`
      INSERT INTO events (title, building_id, room_identifier, date, start_time, end_time, description, created_by)
      VALUES 
        ('Tech Seminar', 1, 'Auditorium', '${tomorrowDate}', '10:00', '12:00', 'Latest trends in technology', 1),
        ('Coding Competition', 2, 'CS Lab', '${nextWeekStr}', '09:00', '17:00', 'Annual coding challenge', 1),
        ('Career Fair', 1, 'Main Hall', '${nextWeekStr}', '10:00', '16:00', 'Meet potential employers', 1)
      ON CONFLICT DO NOTHING;
    `);

    console.log("All sample data inserted successfully!");
  } catch (err) {
    console.error("Error inserting sample data:", err);
  } finally {
    await pool.end();
  }
}

insertSampleData();
