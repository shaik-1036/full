/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
const pool = require("../config/db");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {

    const {
      username,
      email,
      password
    } = req.body;

    if (
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        error: "username, email and password are required"
      });
    }

    const existingUser = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (
        username,
        email,
        password_hash,
        role
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      RETURNING
      user_id,
      username,
      email,
      role,
      created_at
      `,
      [
        username,
        email,
        passwordHash,
        "USER"
      ]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};