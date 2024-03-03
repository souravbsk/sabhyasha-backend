// router.js
module.exports = (app) => {
  const categoryController = require("../controllers/category.controller.js");
  const router = require("express").Router();

  router.post("/create", categoryController.createCategory);
  router.get("/", categoryController.getAllCategories);
  router.get("/:categoryId", categoryController.getCategoryById);
  router.put("/:categoryId", categoryController.updateCategoryById);
  router.delete("/:categoryId", categoryController.deleteCategoryById);


  app.use("/api/category", router);
};
