require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const rateLimit = require("express-rate-limit");

const dbConfig = require("./app/config/db.config");
const logger = require("./app/utils/logger");

const app = express();

// ------------------- SECURITY HEADERS -------------------
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'"],
      "object-src": ["'none'"],
      "upgrade-insecure-requests": [],
    },
  })
);

// ------------------- BODY PARSER -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- CORS -------------------
app.use(cors({ origin: "http://localhost:8081" }));

// ------------------- STATIC FILES -------------------
// Serve test-cors.html and any other static files without API key
app.use(express.static(__dirname));

// ------------------- RATE LIMITING -------------------
// Global rate limiter for all routes except /api/auth
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    message: "Too many requests from this IP. Try again later",
  },
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api/auth")) return next();
  return globalLimiter(req, res, next);
});

// Optional login limiter
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    message: "Too many requests. Please try again later",
  },
});

// ------------------- API KEY MIDDLEWARE -------------------
app.use((req, res, next) => {
  // Skip API key check for root, auth routes, and static HTML files
  if (
    req.path === "/" ||
    req.path.startsWith("/api/auth") ||
    req.path.endsWith(".html")
  ) {
    return next();
  }

  const key = req.headers["x-api-key"];
  if (!key || key !== dbConfig.API_KEY) {
    return res.status(401).json({ message: "Unauthorized: Invalid API key" });
  }

  next();
});

// ------------------- LOGGING -------------------
logger.info("Application started");
logger.info("Server initializing...");
logger.warn("This is a warning test");
logger.error("This is an error test");

// ------------------- DATABASE -------------------
const db = require("./app/models");
const Role = db.role;

const mongoUri = `mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}?authSource=admin`;

db.mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB.");
    initializeRoles();
  })
  .catch((err) => {
    logger.error("MongoDB connection error: " + err.message);
    process.exit();
  });

// ------------------- ROUTES -------------------
// Root route (public)
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// Auth routes (no API key required)
require("./app/routes/auth.routes")(app);

// User routes (API key required)
require("./app/routes/user.routes")(app);

// ------------------- TEST ROUTE FOR CORS -------------------
const testRoutes = require("./app/routes/test.routes");
app.use("/api", testRoutes);

// ------------------- HTTPS SERVER -------------------
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

https.createServer(options, app).listen(8443, () => {
  logger.info("HTTPS server running on port 8443");
});

// ------------------- INITIAL ROLES -------------------
function initializeRoles() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      ["user", "moderator", "admin"].forEach((roleName) => {
        new Role({ name: roleName }).save((err) => {
          if (err) {
            logger.error("Error adding role " + roleName + ": " + err.message);
          } else {
            logger.info(`Added '${roleName}' to roles collection`);
          }
        });
      });
    }
  });
}