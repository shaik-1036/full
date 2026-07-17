/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
const express = require("express");

const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;