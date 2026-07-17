/*
 * Copyright (c) 2026 Your Company Name
 * All rights reserved.
 */
const pool = require("../config/db");

exports.getCustomers = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;

    const offset = (page - 1) * limit;

    const updatedAfter = req.query.updated_after;

    let countQuery =
      "SELECT COUNT(*) FROM customers";

    let dataQuery = `
      SELECT *
      FROM customers
    `;

    let params = [];

    if (updatedAfter) {

      countQuery =
        "SELECT COUNT(*) FROM customers WHERE updated_at > $1";

      dataQuery +=
        " WHERE updated_at > $1";

      params.push(updatedAfter);
    }

    dataQuery += `
      ORDER BY customer_id
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;

    const totalResult =
      await pool.query(countQuery, params);

    const totalRecords =
      parseInt(totalResult.rows[0].count);

    params.push(limit);
    params.push(offset);

    const result =
      await pool.query(dataQuery, params);

    res.json({
      page,
      limit,
      total_records: totalRecords,
      total_pages: Math.ceil(totalRecords / limit),
      updated_after: updatedAfter || null,
      data: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};