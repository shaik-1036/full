/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => {
    console.log("Connected to Neon");
  })
  .catch((err) => {
    console.error("Connection Error:", err);
  });

module.exports = pool;