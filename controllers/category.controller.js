const Category = require("../models/category.model.js");

exports.addCategory = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const categoryData = { name, description, type, createdAt: new Date() };
    const insertedCategory = await Category.addCategory(categoryData);
    res
      .status(201)
      .json({ message: "Category added successfully", data: insertedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
