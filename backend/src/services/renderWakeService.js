const http = require('http');

function startRenderWakeService(app) {
  if (!process.env.RENDER_EXTERNAL_URL) {
    return null;
  }

  const intervalMs = parseInt(process.env.RENDER_WAKE_INTERVAL_MS || '30000', 10);

  const keepAlive = () => {
    http.get(`${process.env.RENDER_EXTERNAL_URL}/health`, (res) => {
      res.resume();
    }).on('error', () => {
      // Ignore ping errors so the process stays alive.
    });
  };

  keepAlive();
  return setInterval(keepAlive, intervalMs);
}

module.exports = { startRenderWakeService };
