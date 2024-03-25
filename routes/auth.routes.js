const passport = require("passport");
const { verifyJwt } = require("../middleware/verifyJwt.js");

module.exports = (app) => {
    const authController = require("../controllers/auth.controller.js");
    const router = require("express").Router();
  
    router.post("/register", authController.registerUser);
    router.post("/login",  authController.loginUser);
    router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/login' }), authController.googleLoginCallback);
    router.get("/logout", authController.logoutUser);
    router.get("/checkAuth", verifyJwt, authController.checkAuth);
  
    app.use("/api/auth", router);
  };
  