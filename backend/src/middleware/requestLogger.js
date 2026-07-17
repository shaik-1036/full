const pool = require("../config/db");

module.exports = async (req, res, next) => {
  const start = Date.now();
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    const duration = Date.now() - start;
    pool.query(
      `
      INSERT INTO api_request_logs (endpoint, response_time, status_code, request_time)
      VALUES ($1, $2, $3, $4)
      `,
      [req.originalUrl, duration, res.statusCode, new Date().toISOString()]
    ).catch(() => {});
    return originalJson(body);
  };

  next();
};
