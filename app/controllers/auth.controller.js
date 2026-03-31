// app/controllers/auth.controller.js

const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const logger = require("../utils/logger");

// In-memory failed login attempts by username + IP
let failedAttempts = {};
const MAX_FAILED_ATTEMPTS = 5;

// Temporary IP block store
let blockedIPs = {};
const BLOCK_TIME_MS = 5 * 60 * 1000; // 5 minutes

// ================= SIGNUP =================
exports.signup = (req, res) => {
  if (!validator.isAlphanumeric(req.body.username)) {
    logger.warn(`Failed signup attempt: Invalid username -> ${req.body.username}`);
    return res.status(400).send({ message: "Invalid username" });
  }

  if (!validator.isEmail(req.body.email)) {
    logger.warn(`Failed signup attempt: Invalid email -> ${req.body.email}`);
    return res.status(400).send({ message: "Invalid email" });
  }

  if (!validator.isLength(req.body.password, { min: 8 })) {
    logger.warn(`Failed signup attempt: Password too short -> ${req.body.username}`);
    return res.status(400).send({ message: "Password must be at least 8 characters" });
  }

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  const assignRoles = (roles) => {
    user.roles = roles.map(r => r._id);
    user.save(err => {
      if (err) {
        logger.error(`User save error: ${err.message}`);
        return res.status(500).send({ message: err.message });
      }
      logger.info(`User signed up successfully: ${user.username}`);
      res.send({ message: "User was registered successfully!" });
    });
  };

  if (req.body.roles && req.body.roles.length > 0) {
    Role.find({ name: { $in: req.body.roles } }, (err, roles) => {
      if (err) {
        logger.error(`Role assignment error: ${err.message}`);
        return res.status(500).send({ message: err.message });
      }
      assignRoles(roles);
    });
  } else {
    Role.findOne({ name: "user" }, (err, role) => {
      if (err) {
        logger.error(`Default role assignment error: ${err.message}`);
        return res.status(500).send({ message: err.message });
      }
      assignRoles([role]);
    });
  }
};

// ================= SIGNIN =================
exports.signin = (req, res) => {
  const username = req.body.username;
  const ip = req.ip;
  const key = `${username}-${ip}`;

  logger.info(`[AUTH] Login attempt | user=${username} | ip=${ip}`);

  // Initialize failedAttempts
  if (!failedAttempts[key]) failedAttempts[key] = 0;

  // 1️⃣ Check if IP is currently blocked
  if (blockedIPs[key] && blockedIPs[key] > Date.now()) {
    logger.error(`[SECURITY] Temporary block active | user=${username} | ip=${ip}`);
    return res.status(429).send({
      message: "Too many failed login attempts. Your IP is temporarily blocked. Try again later."
    });
  } else if (blockedIPs[key] && blockedIPs[key] <= Date.now()) {
    // Block expired
    delete blockedIPs[key];
    failedAttempts[key] = 0;
    logger.info(`[SECURITY] Temporary block expired | user=${username} | ip=${ip}`);
  }

  // 2️⃣ Find user
  User.findOne({ username }).populate("roles", "-__v").exec((err, user) => {
    if (err) {
      logger.error(`Signin error: ${err.message}`);
      return res.status(500).send({ message: err.message });
    }

    // USER NOT FOUND
    if (!user) {
      failedAttempts[key]++;
      logger.warn(`[AUTH] Failed login attempt ${failedAttempts[key]} | User not found -> ${username} | ip=${ip}`);

      if (failedAttempts[key] === MAX_FAILED_ATTEMPTS) {
        blockedIPs[key] = Date.now() + BLOCK_TIME_MS;
        logger.error(`[SECURITY] IP temporarily blocked for 5 minutes | user=${username} | ip=${ip}`);
      }
      return res.status(404).send({ message: "User Not found." });
    }

    // PASSWORD VALIDATION
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      failedAttempts[key]++;
      logger.warn(`[AUTH] Failed login attempt ${failedAttempts[key]} | Invalid password -> ${username} | ip=${ip}`);

      if (failedAttempts[key] === MAX_FAILED_ATTEMPTS) {
        blockedIPs[key] = Date.now() + BLOCK_TIME_MS;
        logger.error(`[SECURITY] IP temporarily blocked for 5 minutes | user=${username} | ip=${ip}`);
      }
      return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
    }

    // ✅ Successful login resets counters
    delete failedAttempts[key];
    if (blockedIPs[key]) delete blockedIPs[key];

    const token = jwt.sign({ id: user._id }, config.secret, { algorithm: "HS256", expiresIn: 86400 });
    const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

    logger.info(`[AUTH] User signed in successfully | user=${user.username} | ip=${ip}`);

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  });
};

// ================= GET CURRENT USER =================
exports.me = (req, res) => {
  User.findById(req.userId).select("-password -__v").exec((err, user) => {
    if (err) {
      logger.error(`Get current user error: ${err.message}`);
      return res.status(500).send({ message: err.message });
    }
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    logger.info(`[AUTH] Current user fetched | user=${user.username} | id=${user._id}`);
    res.status(200).send(user);
  });
};