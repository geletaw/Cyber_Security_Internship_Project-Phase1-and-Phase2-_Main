const express = require("express");
const router = express.Router();

// Simple CORS test route using API key
router.get("/test", (req, res) => {
  res.json({ message: "CORS and API key test successful!" });
});

module.exports = router;