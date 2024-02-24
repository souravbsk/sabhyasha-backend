const collections = require("../Utility/collections");
const { getSabhyashadb } = require("../Utility/db");

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, image, } = req.body;
    const categoryData = {
      name: name,
      email,
      role,
      created_At: new Date(),
      updated_At: new Date(),
    };

    const sabhyashadb = getSabhyashadb();
    const categoryCollection = sabhyashadb.collection(collections.categories);

    const insertedCategory = await categoryCollection.insertOne(categoryData);

    res.status(201).json({
      message: "Category created successfully",
      data: insertedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
