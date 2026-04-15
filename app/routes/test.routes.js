const express = require("express");
const router = express.Router();
const csrf = require("csurf");

// CSRF middleware using cookie
const csrfProtection = csrf({ cookie: true });

// GET CSRF token
router.get("/test/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// gela new for csrf



// gela new for csrf

// POST test route (CSRF protected)
router.post("/test", csrfProtection, (req, res) => {
  console.log("Received CSRF POST:", req.body); // <-- logs in server console
  res.json({
    message: "CSRF request accepted",
    dataReceived: req.body,
    csrfTokenUsed: req.body._csrf,
  });
});

module.exports = router;