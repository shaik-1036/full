/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
const express = require("express");

const router = express.Router();

const orderController = require(
  "../controllers/orderController"
);

router.get(
  "/",
  orderController.getOrders
);

module.exports = router;