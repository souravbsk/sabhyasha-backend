// router.js
module.exports = (app) => {
    const categoryController = require("../controllers/category.controller.js");
    const router = require("express").Router();
  
    router.post("/create", categoryController.addCategory);

    app.use("/api/category", router);
  };
  