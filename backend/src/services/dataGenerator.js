const pool = require("../config/db");

async function generateData(options = {}) {
  const targetSizeGb = options.targetSizeGb || 10;
  const duplicatePercent = options.duplicatePercent || 5;
  const startDate = options.startDate || "2025-01-01";
  const endDate = options.endDate || "2025-12-31";
  const dailyLoad = options.dailyLoad || 1000;

  const customerCount = Math.max(1, Math.round(targetSizeGb * 1000 + dailyLoad));
  const productCount = Math.max(1, Math.round(targetSizeGb * 500 + dailyLoad / 2));
  const orderCount = Math.max(1, Math.round(targetSizeGb * 2000 + dailyLoad * 4));

  for (let i = 0; i < customerCount; i += 1) {
    await pool.query(
      `INSERT INTO customers (first_name, last_name, email, phone, city, country, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT DO NOTHING`,
      [
        `Customer${i}`,
        `User${i}`,
        `customer${i}@example.com`,
        `555000${i % 1000}`,
        i % 2 === 0 ? "Chicago" : "Austin",
        "USA",
        new Date(startDate),
        new Date(endDate)
      ]
    );
  }

  for (let i = 0; i < productCount; i += 1) {
    await pool.query(
      `INSERT INTO products (product_name, category, price, stock_quantity, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      [`Product ${i}`, i % 2 === 0 ? "Electronics" : "Furniture", 10 + i, 100 + i, new Date(startDate), new Date(endDate)]
    );
  }

  for (let i = 0; i < orderCount; i += 1) {
    await pool.query(
      `INSERT INTO orders (customer_id, order_date, total_amount, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        (i % 10) + 1,
        new Date(startDate),
        20 + i,
        i % 2 === 0 ? "Completed" : "Pending",
        new Date(startDate),
        new Date(endDate)
      ]
    );
  }

  return {
    targetSizeGb,
    duplicatePercent,
    startDate,
    endDate,
    dailyLoad,
    customerCount,
    productCount,
    orderCount
  };
}

module.exports = { generateData };