const pool = require("../config/db");

const buildListQuery = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const offset = (page - 1) * limit;
  const updatedAfter = req.query.updated_after;
  const status = req.query.status;
  const orderId = req.query.order_id;

  let where = [];
  const params = [];

  if (updatedAfter) {
    where.push("payment_date > $1");
    params.push(updatedAfter);
  }
  if (status) {
    where.push(`payment_status = $${params.length + 1}`);
    params.push(status);
  }
  if (orderId) {
    where.push(`order_id = $${params.length + 1}`);
    params.push(orderId);
  }

  const countQuery = `SELECT COUNT(*)::int AS count FROM payments${where.length ? ` WHERE ${where.join(" AND ")}` : ""}`;
  const dataQuery = `SELECT * FROM payments${where.length ? ` WHERE ${where.join(" AND ")}` : ""} ORDER BY payment_id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

  return { page, limit, offset, countQuery, dataQuery, params };
};

exports.getPayments = async (req, res) => {
  try {
    const { page, limit, offset, countQuery, dataQuery, params } = buildListQuery(req);
    const totalResult = await pool.query(countQuery, params);
    const totalRecords = totalResult.rows[0].count;
    const result = await pool.query(dataQuery, [...params, limit, offset]);

    res.json({
      page,
      limit,
      total_records: totalRecords,
      total_pages: Math.ceil(totalRecords / limit),
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
