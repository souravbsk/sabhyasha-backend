const express = require("express");
const { connectToDB } = require("./Utility/db.js");
const app = express();
const cors = require("cors");
// const usersRoutes = require("./routes/user.routes.js");
// const SubcategoryRoutes = require("./routes/subcategory.routes.js");

const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
require('./routes/category.routes.js')(app);

app.get("/",(req,res) => {
  res.send("hello world")
})

// Start the server after connecting to MongoDB
connectToDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(console.error);
