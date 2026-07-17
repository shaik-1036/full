/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const pool = require("./config/db");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const returnRoutes = require("./routes/returnRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authMiddleware = require("./middleware/auth");
const requestLogger = require("./middleware/requestLogger");

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later."
  }
});

app.use("/api", limiter);
app.use("/api", requestLogger);
app.use("/api", (req, res, next) => {
  if (req.path.startsWith("/auth")) {
    return next();
  }
  return authMiddleware(req, res, next);
});

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
app.use("/api/payments", paymentRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

async function initializeDatabase() {
  const ddlPath = path.join(__dirname, "../database/ddl/001_create_tables.sql");
  const ddl = fs.readFileSync(ddlPath, "utf8");
  await pool.query(ddl);
  console.log("Database schema initialized");
}

initializeDatabase()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server started");
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });