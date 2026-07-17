const pool = require("../config/db");

exports.getSuppliers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const updatedAfter = req.query.updated_after;
    const name = req.query.name;

    let where = [];
    const params = [];

    if (updatedAfter) {
      where.push("created_at > $1");
      params.push(updatedAfter);
    }
    if (name) {
      where.push(`supplier_name ILIKE $${params.length + 1}`);
      params.push(`%${name}%`);
    }

    const countQuery = `SELECT COUNT(*)::int AS count FROM suppliers${where.length ? ` WHERE ${where.join(" AND ")}` : ""}`;
    const dataQuery = `SELECT * FROM suppliers${where.length ? ` WHERE ${where.join(" AND ")}` : ""} ORDER BY supplier_id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const totalResult = await pool.query(countQuery, params);
    const totalRecords = totalResult.rows[0].count;
    const result = await pool.query(dataQuery, [...params, limit, offset]);

    res.json({ page, limit, total_records: totalRecords, total_pages: Math.ceil(totalRecords / limit), data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
