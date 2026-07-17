const express = require("express");
const router = express.Router();
const { refreshData } = require("../services/scheduledDataService");

router.post("/run", async (req, res) => {
  try {
    const result = await refreshData();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
