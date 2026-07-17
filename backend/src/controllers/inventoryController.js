const pool = require("../config/db");

exports.getInventory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const productId = req.query.product_id;
    const warehouseId = req.query.warehouse_id;

    let where = [];
    const params = [];

    if (productId) {
      where.push(`product_id = $${params.length + 1}`);
      params.push(productId);
    }
    if (warehouseId) {
      where.push(`warehouse_id = $${params.length + 1}`);
      params.push(warehouseId);
    }

    const countQuery = `SELECT COUNT(*)::int AS count FROM inventory${where.length ? ` WHERE ${where.join(" AND ")}` : ""}`;
    const dataQuery = `SELECT * FROM inventory${where.length ? ` WHERE ${where.join(" AND ")}` : ""} ORDER BY inventory_id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const totalResult = await pool.query(countQuery, params);
    const totalRecords = totalResult.rows[0].count;
    const result = await pool.query(dataQuery, [...params, limit, offset]);

    res.json({ page, limit, total_records: totalRecords, total_pages: Math.ceil(totalRecords / limit), data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
