/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error", err);
});

async function verifyConnection() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Connected to Neon");
  } catch (err) {
    console.error("Connection Error:", err.message);
  }
}

verifyConnection();

module.exports = pool;