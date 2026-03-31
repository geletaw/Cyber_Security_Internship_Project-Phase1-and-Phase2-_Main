// app/middlewares/authJwt.js
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

// ----------------- JWT VERIFICATION -----------------
verifyToken = (req, res, next) => {
  // Accept token from Authorization header (Bearer) or x-access-token
  let token = req.headers["authorization"] || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  // Remove 'Bearer ' prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  // Verify JWT
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log("JWT verification error:", err.message); // debug
      return res.status(401).send({ message: "Unauthorized!" });
    }

    req.userId = decoded.id;
    next();
  });
};

// ----------------- ROLE CHECK: ADMIN -----------------
isAdmin = (req, res, next) => {
  User.findById(req.userId).populate("roles").exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (user.roles.some(role => role.name === "admin")) {
      next();
      return;
    }
    res.status(403).send({ message: "Require Admin Role!" });
  });
};

// ----------------- ROLE CHECK: MODERATOR -----------------
isModerator = (req, res, next) => {
  User.findById(req.userId).populate("roles").exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (user.roles.some(role => role.name === "moderator")) {
      next();
      return;
    }
    res.status(403).send({ message: "Require Moderator Role!" });
  });
};

// ----------------- EXPORT -----------------
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};

module.exports = authJwt;