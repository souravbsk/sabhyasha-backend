const express = require("express");
const { connectToDB } = require("./Utility/db.js");
const app = express();
const cors = require("cors");
const multer = require('multer');
const upload = multer();
const port = 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require("passport");
require('dotenv').config()

const cookieParser = require('cookie-parser');


// Middleware
app.use(cors());
app.use(express.json());
app.use(upload.any());
app.use(bodyParser.raw({ limit: '10mb' }));
app.use(cookieParser());
app.use(session({
  secret: process.env.ACCESS_TOKEN_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
require('./Utility/passport.config.js');
// Routes
require('./routes/blog.routes.js')(app);
require('./routes/category.routes.js')(app);
require('./routes/user.routes.js')(app);
require('./routes/upload.routes.js')(app);
require('./routes/auth.routes.js')(app);

app.get("/", (req, res) => {
  res.send("hello world")
})

// Start the server after connecting to MongoDB
connectToDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(console.error);
