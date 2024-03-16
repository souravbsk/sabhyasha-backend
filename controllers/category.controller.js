const { ObjectId } = require("mongodb");
const collections = require("../Utility/collections");
const { getSabhyashadb } = require("../Utility/db");
const slugGenerate = require("../middleware/slugGenerate");

// create a new  category 
exports.createCategory = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const categoryData = { name, description, type, createdAt: new Date() };

    const sabhyashadb = getSabhyashadb();
    const categoryCollection = sabhyashadb.collection(collections.categories);



    // slug url start
    let generateSlugUrl = await slugGenerate(name);
    const existingCategories = await categoryCollection.find({ slug: generateSlugUrl }).toArray();
    if (existingCategories.length > 0) {
      const totalCount = await categoryCollection.countDocuments();
      let newSlug = generateSlugUrl;
      while (existingCategories.find(category => category.slug === newSlug)) {
        newSlug = `${generateSlugUrl}-${totalCount}`;
      }
      generateSlugUrl = newSlug;
    }
    //slug url end



    const insertedCategory = await categoryCollection.insertOne({ ...categoryData, slug: generateSlugUrl });
    if (!insertedCategory) {
      res.status(404).json({ error: "Category not found" });
    }
    res.status(201).json({
      message: "Category created successfully",
      data: insertedCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Update category by ID
exports.updateCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    console.log(categoryId, req.body)
    const { name, description, type } = req.body;
    const updatedAt = new Date();

    const sabhyashadb = getSabhyashadb();
    const categoryCollection = sabhyashadb.collection(collections.categories);


    const generateSlugUrl = await slugGenerate(name, categoryCollection);



    const result = await categoryCollection.updateOne(
      { _id: new ObjectId(categoryId) },
      { $set: { name, description, type, updatedAt, slug: generateSlugUrl } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: result
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
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};