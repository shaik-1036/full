/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
const express = require("express");

const router = express.Router();

const customerController = require(
  "../controllers/customerController"
);

router.get(
  "/",
  customerController.getCustomers
);

module.exports = router;