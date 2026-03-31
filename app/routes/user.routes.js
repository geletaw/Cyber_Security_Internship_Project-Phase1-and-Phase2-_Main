const controller = require("../controllers/user.controller");
const dbConfig = require("../config/db.config"); // to get API_KEY

module.exports = function(app) {
  // ------------------- Phase 1 Routes (keep everything) -------------------
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept, Authorization, x-api-key"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", controller.userBoard);
  app.get("/api/test/mod", controller.moderatorBoard);
  app.get("/api/test/admin", controller.adminBoard);
  app.get("/api/users/me", (req, res) => {
    res.status(200).send({
      message: "User profile accessed successfully",
    });
  });

  // -------------------- NEW WEEK 4 ROUTE --------------------
  // GET all users - API KEY only
  app.get("/api/user", (req, res, next) => {
    const key = req.headers["x-api-key"];
    if (!key || key !== dbConfig.API_KEY) {
      return res.status(401).json({ message: "Unauthorized: Invalid API key" });
    }
    next();
  }, controller.allUsers);
};