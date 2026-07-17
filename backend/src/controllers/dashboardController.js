const pool = require("../config/db");

exports.getMetrics = async (req, res) => {
  try {
    const [customers, products, orders] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM customers"),
      pool.query("SELECT COUNT(*)::int AS count FROM products"),
      pool.query("SELECT COUNT(*)::int AS count FROM orders")
    ]);

    res.json({
      customers: customers.rows[0].count,
      products: products.rows[0].count,
      orders: orders.rows[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
