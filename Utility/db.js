const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri =
  `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.ep4uwoa.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let sabhyashadb;

async function connectToDB() {
  try {
    await client.connect();
    sabhyashadb = client.db("sabhyashadb");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

function getSabhyashadb() {
  return sabhyashadb;
}

module.exports = {
  connectToDB,
  getSabhyashadb,
  getClient: () => client,
};
