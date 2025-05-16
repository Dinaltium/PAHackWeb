import pg from "pg";
const { Pool } = pg;

// Get connection details from environment variables or use defaults
const config = {
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "rafan",
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || "hackpace",
};

console.log(
  `Connecting to PostgreSQL database ${config.database} on ${config.host}:${config.port} as ${config.user}...`
);

// Create connection pool
const pool = new Pool(config);

// Test the connection
pool
  .connect()
  .then((client) => {
    console.log("✅ Connection successful!");
    client.release();
    pool.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);

    if (err.code === "3D000") {
      console.log(
        `\nThe database '${config.database}' doesn't exist. Please create it first.`
      );
    } else if (err.code === "28P01") {
      console.log("\nAuthentication failed. Check your username and password.");
    } else if (err.code === "ECONNREFUSED") {
      console.log(
        "\nConnection refused. Make sure PostgreSQL is running and check host/port."
      );
    }

    pool.end();
    process.exit(1);
  });
