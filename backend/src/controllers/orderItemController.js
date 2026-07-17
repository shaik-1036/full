const pool = require("../config/db");

exports.getOrderItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const orderId = req.query.order_id;
    const productId = req.query.product_id;

    let where = [];
    const params = [];

    if (orderId) {
      where.push(`order_id = $${params.length + 1}`);
      params.push(orderId);
    }

    if (productId) {
      where.push(`product_id = $${params.length + 1}`);
      params.push(productId);
    }

    const countQuery = `SELECT COUNT(*)::int AS count FROM order_items${where.length ? ` WHERE ${where.join(" AND ")}` : ""}`;
    const dataQuery = `SELECT * FROM order_items${where.length ? ` WHERE ${where.join(" AND ")}` : ""} ORDER BY order_item_id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const totalResult = await pool.query(countQuery, params);
    const totalRecords = totalResult.rows[0].count;
    const result = await pool.query(dataQuery, [...params, limit, offset]);

    res.json({ page, limit, total_records: totalRecords, total_pages: Math.ceil(totalRecords / limit), data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
