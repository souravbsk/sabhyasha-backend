const { ObjectId } = require("mongodb");
const collections = require("../Utility/collections");
const { getSabhyashadb } = require("../Utility/db");

// create a new  category 
exports.createCategory = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const categoryData = { name, description, type, createdAt: new Date() };

    const sabhyashadb = getSabhyashadb();
    const categoryCollection = sabhyashadb.collection(collections.categories);

    const insertedCategory = await categoryCollection.insertOne(categoryData);
    if (!insertedCategory) {
      res.status(404).json({ error: "Category not found" });
    }
    res.status(201).json({
      message: "Category created successfully",
      data: insertedCategory,np
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// get all category 
exports.getAllCategories = async (req, res) => {
  try {
    const sabhyashadb = getSabhyashadb();
    const categoryCollection = sabhyashadb.collection(collections.categories);

    const categories = await categoryCollection.find({}).toArray();
    if (!categories) {
      res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// get single category

exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const sabhyashadb = getSabhyashadb();
    const categoryCollection = sabhyashadb.collection(collections.categories);

    const category = await categoryCollection.findOne({ _id: new ObjectId(categoryId) });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// remove category by id 

exports.deleteCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const sabhyashadb = getSabhyashadb();
    const categoryCollection = sabhyashadb.collection(collections.categories);

    const result = await categoryCollection.deleteOne({ _id: new ObjectId(categoryId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      data:result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};