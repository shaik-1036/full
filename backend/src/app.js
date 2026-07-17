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
const orderItemRoutes = require("./routes/orderItemRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const refreshRoutes = require("./routes/refreshRoutes");
const authMiddleware = require("./middleware/auth");
const requestLogger = require("./middleware/requestLogger");
const { refreshData } = require("./services/scheduledDataService");
const { startRenderWakeService } = require("./services/renderWakeService");

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
  const publicPaths = [
    "/auth",
    "/customers",
    "/products",
    "/orders",
    "/order-items",
    "/payments",
    "/suppliers",
    "/warehouses",
    "/inventory",
    "/shipments",
    "/returns",
    "/dashboard/metrics"
  ];

  const isPublicGetRequest = req.method === "GET" && publicPaths.some((path) => req.path === path || req.path.startsWith(`${path}/`));

  if (req.path.startsWith("/auth") || isPublicGetRequest) {
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
app.use("/api/order-items", orderItemRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/refresh", refreshRoutes);

async function initializeDatabase() {
  const ddlPath = path.join(__dirname, "../database/ddl/001_create_tables.sql");
  const ddl = fs.readFileSync(ddlPath, "utf8");
  await pool.query(ddl);
  console.log("Database schema initialized");
}

function startScheduledRefresh() {
  const refreshHour = parseInt(process.env.DATA_REFRESH_HOUR || "4", 10);
  const refreshMinute = parseInt(process.env.DATA_REFRESH_MINUTE || "0", 10);
  const nextRunAt = new Date();
  nextRunAt.setHours(refreshHour, refreshMinute, 0, 0);

  if (nextRunAt <= new Date()) {
    nextRunAt.setDate(nextRunAt.getDate() + 1);
  }

  const delayMs = Math.max(1000, nextRunAt.getTime() - Date.now());

  const runRefresh = async () => {
    try {
      const result = await refreshData();
      console.log("Nightly data refresh completed", result.output || result.message);
    } catch (error) {
      console.error("Nightly data refresh failed", error);
    }
  };

  setTimeout(() => {
    runRefresh();
    setInterval(runRefresh, 24 * 60 * 60 * 1000);
  }, delayMs);

  console.log(`Scheduled nightly refresh for ${String(refreshHour).padStart(2, "0")}:${String(refreshMinute).padStart(2, "0")}`);
}

initializeDatabase()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server started");
      startScheduledRefresh();
      startRenderWakeService(app);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });