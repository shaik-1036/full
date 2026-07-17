/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
const express = require("express");

const router = express.Router();

const productController = require(
  "../controllers/productController"
);

router.get(
  "/",
  productController.getProducts
);

module.exports = router;