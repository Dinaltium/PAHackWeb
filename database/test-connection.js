import pg from "pg";
import readline from "readline";

const { Pool } = pg;

// Create interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask for PostgreSQL credentials
rl.question("PostgreSQL username (default: postgres): ", (username) => {
  username = username || "postgres";

  rl.question("PostgreSQL password: ", (password) => {
    rl.question("PostgreSQL host (default: localhost): ", (host) => {
      host = host || "localhost";

      rl.question("PostgreSQL port (default: 5432): ", (port) => {
        port = port || "5432";

        rl.question(
          "PostgreSQL database (default: pahackweb): ",
          (database) => {
            database = database || "pahackweb";

            console.log("\nTesting connection to PostgreSQL...");

            const connectionString = `postgres://${username}:${password}@${host}:${port}/${database}`;
            console.log(
              `Connection string: postgres://${username}:***@${host}:${port}/${database}`
            );

            const pool = new Pool({ connectionString });

            pool
              .query("SELECT NOW() as current_time")
              .then((result) => {
                console.log("\n✅ Connection to PostgreSQL successful!");
                console.log(
                  `Current database time: ${result.rows[0].current_time}`
                );

                // Check for required tables
                return pool.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
              `);
              })
              .then((result) => {
                const tables = result.rows.map((row) => row.table_name);

                console.log("\nDetected tables:");
                if (tables.length === 0) {
                  console.log(
                    "No tables found. You may need to run migrations."
                  );
                } else {
                  tables.forEach((table) => console.log(`- ${table}`));
                }

                const requiredTables = [
                  "users",
                  "buildings",
                  "classrooms",
                  "courses",
                  "events",
                  "favorites",
                  "student_locations",
                ];
                const missingTables = requiredTables.filter(
                  (table) => !tables.includes(table)
                );

                if (missingTables.length > 0) {
                  console.log("\n⚠️ Some required tables are missing:");
                  missingTables.forEach((table) => console.log(`- ${table}`));
                  console.log(
                    "\nRun database migrations with: npx drizzle-kit push"
                  );
                } else if (tables.length >= requiredTables.length) {
                  console.log("\n✅ All required tables detected!");
                }

                // Set up the DATABASE_URL for the application
                console.log(
                  "\nTo use this database with the application, set the DATABASE_URL environment variable:"
                );
                console.log("\nOn Windows:");
                console.log(`set DATABASE_URL=${connectionString}`);
                console.log("\nOn Linux/Mac:");
                console.log(`export DATABASE_URL=${connectionString}`);
              })
              .catch((err) => {
                console.error("\n❌ Connection failed:", err.message);
                if (err.code === "3D000") {
                  console.log(
                    `\nThe database '${database}' doesn't exist. Create it with:`
                  );
                  console.log(`createdb -U ${username} ${database}`);
                  console.log("\nOr in psql:");
                  console.log(`CREATE DATABASE ${database};`);
                } else if (err.code === "28P01") {
                  console.log(
                    "\nAuthentication failed. Check your username and password."
                  );
                } else if (err.code === "ECONNREFUSED") {
                  console.log(
                    "\nConnection refused. Make sure PostgreSQL is running and check host/port."
                  );
                }
              })
              .finally(() => {
                rl.close();
                pool.end();
              });
          }
        );
      });
    });
  });
});
