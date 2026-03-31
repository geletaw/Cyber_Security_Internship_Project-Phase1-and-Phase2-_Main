module.exports = (app) => {
  const controller = require("../controllers/auth.controller");
  const { authJwt } = require("../middlewares");

  const router = require("express").Router();

  // ================= SIGNUP =================
  router.post("/signup", controller.signup);

  // ================= SIGNIN =================
  router.post("/signin", controller.signin);

  // ================= GET CURRENT USER =================
  router.get("/me", authJwt.verifyToken, controller.me);

  // ✅ Mount router
  app.use("/api/auth", router);
};