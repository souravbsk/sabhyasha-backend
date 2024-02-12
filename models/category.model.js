const { ObjectId } = require("mongodb");
const { getSabhyashadb } = require("../Utility/db");

//add category 
const addCategory = async (categroyData) => {
    const sabhyashadb = getSabhyashadb(); // Invoke the function to get the database instance
    const categoryCollection = sabhyashadb.collection("categories");
    return categoryCollection.insertOne(categroyData);
  };
  
  module.exports = {
    addCategory,
  };
  