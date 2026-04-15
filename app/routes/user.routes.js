const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.user;

// Middleware to load user by X-USER-ID
router.use(async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "Missing X-USER-ID header" });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure roles exist and are strings
    if (!user.roles || !Array.isArray(user.roles)) {
      user.roles = [];
    } else {
      user.roles = user.roles.map(r => (typeof r === "string" ? r : String(r)));
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error loading user" });
  }
});

// GET /api/user -> list all users (admin only)
router.get("/", async (req, res) => {
  try {
    if (!req.user.roles.includes("admin")) {
      return res.status(403).json({ message: "Forbidden: Only admins can view all users" });
    }

    const users = await User.find({}, { username: 1, email: 1, roles: 1 }).lean();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error fetching users" });
  }
});

// GET /api/user/:id -> get user by id
router.get("/:id", async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id, { username: 1, email: 1, roles: 1 }).lean();
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow access if admin or the user itself
    if (!req.user.roles.includes("admin") && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Forbidden: Cannot access other users" });
    }

    return res.json(targetUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error fetching user" });
  }
});

module.exports = (app) => {
  app.use("/api/user", router);
};