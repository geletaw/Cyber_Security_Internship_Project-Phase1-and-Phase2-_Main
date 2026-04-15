const db = require("../models");
const User = db.user;

module.exports = async function (req, res, next) {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(400).json({ message: "Invalid or missing X-USER-ID" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Normalize roles: convert ObjectId to string, keep string roles
    if (!user.roles || !Array.isArray(user.roles)) {
      user.roles = [];
    } else {
      user.roles = user.roles.map((r) =>
        typeof r === "string" ? r : r.toString()
      );
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error: User roles not found" });
  }
};