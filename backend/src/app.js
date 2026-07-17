/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
const express = require("express");
const cors = require("cors");

require("dotenv").config();



const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes =require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    application: "Enterprise Data Platform API",
    status: "Running"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "UP"
  });
});

app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use(
  "/api/auth",
  authRoutes
);
console.log("DATABASE_URL =", process.env.DATABASE_URL);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started");
});