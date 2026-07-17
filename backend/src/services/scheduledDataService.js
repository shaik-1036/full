const pool = require("../config/db");

const RETENTION_DAYS = parseInt(process.env.DATA_RETENTION_DAYS || "4", 10);

async function refreshData() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

  await pool.query(`DELETE FROM returns WHERE created_at < $1`, [cutoffDate]);
  await pool.query(`DELETE FROM shipments WHERE created_at < $1`, [cutoffDate]);
  await pool.query(`DELETE FROM inventory WHERE created_at < $1`, [cutoffDate]);
  await pool.query(`DELETE FROM warehouses WHERE created_at < $1`, [cutoffDate]);
  await pool.query(`DELETE FROM suppliers WHERE created_at < $1`, [cutoffDate]);
  await pool.query(`DELETE FROM payments WHERE created_at < $1`, [cutoffDate]);
  await pool.query(`DELETE FROM order_items WHERE order_id IN (SELECT order_id FROM orders WHERE created_at < $1)`, [cutoffDate]);
  await pool.query(`DELETE FROM orders WHERE created_at < $1`, [cutoffDate]);
  await pool.query(`DELETE FROM products WHERE created_at < $1`, [cutoffDate]);
  await pool.query(`DELETE FROM customers WHERE created_at < $1`, [cutoffDate]);

  const customerCount = 300;
  const productCount = 120;
  const orderCount = 500;
  const paymentCount = 250;

  for (let i = 0; i < customerCount; i += 1) {
    await pool.query(
      `INSERT INTO customers (first_name, last_name, email, phone, city, country, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [`Customer${i}`, `User${i}`, `customer${i}@example.com`, `555000${i % 1000}`, i % 2 === 0 ? "Chicago" : "Austin", "USA"]
    );
  }

  for (let i = 0; i < productCount; i += 1) {
    await pool.query(
      `INSERT INTO products (product_name, category, price, stock_quantity, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [`Product ${i}`, i % 2 === 0 ? "Electronics" : "Furniture", 10 + i, 100 + i]
    );
  }

  for (let i = 0; i < orderCount; i += 1) {
    const customerId = (i % 50) + 1;
    await pool.query(
      `INSERT INTO orders (customer_id, order_date, total_amount, status, created_at, updated_at)
       VALUES ($1, NOW(), $2, $3, NOW(), NOW())`,
      [customerId, 20 + i, i % 2 === 0 ? "Completed" : "Pending"]
    );
  }

  for (let i = 0; i < paymentCount; i += 1) {
    await pool.query(
      `INSERT INTO payments (order_id, payment_method, payment_status, payment_amount, payment_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW(), NOW())`,
      [i % 200 + 1, i % 2 === 0 ? "Card" : "Cash", i % 2 === 0 ? "Completed" : "Pending", 10 + i]
    );
  }

  await pool.query(`
    INSERT INTO suppliers (supplier_name, contact_name, email, phone, city, country, created_at, updated_at)
    VALUES ('Northwind Supplies', 'Alice Johnson', 'alice@northwind.com', '5550101', 'Chicago', 'USA', NOW(), NOW()),
           ('Global Goods', 'Brian Lee', 'brian@globalgoods.com', '5550102', 'Austin', 'USA', NOW(), NOW())
  `);

  await pool.query(`
    INSERT INTO warehouses (warehouse_name, city, country, created_at, updated_at)
    VALUES ('Main Warehouse', 'Chicago', 'USA', NOW(), NOW()),
           ('West Hub', 'Denver', 'USA', NOW(), NOW())
  `);

  await pool.query(`
    INSERT INTO inventory (product_id, warehouse_id, stock_quantity, created_at, updated_at)
    VALUES (1, 1, 25, NOW(), NOW()), (2, 1, 100, NOW(), NOW()), (3, 2, 50, NOW(), NOW())
  `);

  await pool.query(`
    INSERT INTO shipments (order_id, warehouse_id, status, shipped_at, created_at, updated_at)
    VALUES (1, 1, 'Shipped', NOW(), NOW(), NOW()), (2, 2, 'Pending', NOW(), NOW(), NOW())
  `);

  await pool.query(`
    INSERT INTO returns (order_id, reason, status, return_date, created_at, updated_at)
    VALUES (2, 'Damaged item', 'Requested', NOW(), NOW(), NOW())
  `);

  return { message: "Data refresh completed" };
}

module.exports = { refreshData, RETENTION_DAYS };