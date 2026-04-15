require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");

const dbConfig = require("./app/config/db.config");
const logger = require("./app/utils/logger");

const app = express();
app.disable("x-powered-by");

// ------------------- SECURITY HEADERS -------------------
app.use(
  helmet({
    xContentTypeOptions: true, // ✅ FORCE FIX
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "upgrade-insecure-requests": [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// =====================================================
// ✅ GLOBAL HEADERS (AFTER HELMET)
// =====================================================
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

// ------------------- CACHE CONTROL -------------------
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  } else {
    res.setHeader("Cache-Control", "public, max-age=31536000");
  }
  next();
});

// ------------------- BODY PARSER -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- COOKIE -------------------
app.use(cookieParser());

// ------------------- INPUT SECURITY -------------------
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

app.use(xss());
app.use(mongoSanitize());

// ------------------- BLOCK SENSITIVE FILES -------------------
app.use((req, res, next) => {
  const blocked = [".pem", ".env", ".git", ".log"];

  if (blocked.some((ext) => req.url.includes(ext))) {
    return res.status(403).send("Forbidden");
  }

  if (req.url.match(/\/\./)) {
    return res.status(403).send("Forbidden");
  }

  next();
});

// ------------------- CSRF -------------------
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  },
});

// ------------------- CORS -------------------
app.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

// ------------------- STATIC FILES (FIX INCLUDED) -------------------
app.use(
  express.static("public", {
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

// ------------------- RATE LIMITING -------------------
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { message: "Too many requests from this IP. Try again later" },
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api/auth")) return next();
  return globalLimiter(req, res, next);
});

// ------------------- API KEY MIDDLEWARE -------------------
app.use((req, res, next) => {
  if (
    req.path === "/" ||
    req.path.startsWith("/api/auth") ||
    req.path.endsWith(".html") ||
    req.path === "/form"
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
app.get("/", (req, res) => {
  res.setHeader("X-Content-Type-Options", "nosniff"); // ✅ extra guarantee
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

const testRoutes = require("./app/routes/test.routes");
app.use("/api", testRoutes);

// ------------------- CSRF ROUTES -------------------
app.get("/form", csrfProtection, (req, res) => {
  res.send(`
    <h2>CSRF Test Form</h2>
    <form method="POST" action="/api/test">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
      <button type="submit">Send Request</button>
    </form>
  `);
});

app.get("/api/test/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post("/api/test", csrfProtection, (req, res) => {
  res.json({
    message: "CSRF request accepted",
    dataReceived: req.body,
    csrfTokenUsed: req.body._csrf,
  });
});

// ------------------- HTTPS SERVER -------------------
const options = {
  key: fs.readFileSync("C:/secure/localhost+1-key.pem"),
  cert: fs.readFileSync("C:/secure/localhost+1.pem"),
};

https.createServer(options, app).listen(8443, "0.0.0.0", () => {
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