// router.js
module.exports = (app) => {
  const user = require("../controllers/user.controller.js");
  const router = require("express").Router();

  router.post("/create", user.createUser);

  app.use("/api/user", router);
};
