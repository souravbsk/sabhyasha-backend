const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");

const session = require("express-session");

const bodyParser = require("body-parser");
const { connectDB } = require("./utlis/connectDB");
const cookieParser = require("cookie-parser");

require("dotenv").config();
// changed cors origin to * for testing
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.raw({ limit: "100mb" }));


app.use(cookieParser());
app.use(
  session({
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./middlewares/passport.config.js");

const { blogRoute } = require("./routes/blog.routes");
const { blogCategoryRoute } = require("./routes/blogCategory.routes.js");
const { blogCommentRoute } = require("./routes/blogComment.routes.js");
const {
  categoryCustomizedRoute,
} = require("./routes/categoryCustomizedField.routes.js");
const { couponRoute } = require("./routes/coupon.routes.js");
const { parentCategoryRoute } = require("./routes/parentCategory.routes.js");
const { productRoute } = require("./routes/product.routes.js");
const { productCategoryRoute } = require("./routes/productCategory.routes.js");
const { storeRoute } = require("./routes/store.routes.js");
const { productSubCategoryRoute } = require("./routes/subCategory.routes.js");
const { userAuth } = require("./routes/auth.routes.js");
const { addressRouter } = require("./routes/address.routes.js");
const { mediaRoute } = require("./routes/media.routes.js");
const { profileRouter } = require("./routes/profile.routes.js");
const { cartRouter } = require("./routes/cart.routes.js");
const { wishListRouter } = require("./routes/wishlist.routes.js");
const { userRouter } = require("./routes/user.routes.js");
const { checkoutRoute } = require("./routes/cheackout.routes.js");

connectDB();
app.get("/", (req, res) => {
  res.send("Hello World from server");
});
//blog api start
app.use("/api/blog", blogRoute);
app.use("/api/category", blogCategoryRoute);
app.use("/api/blogComment", blogCommentRoute);
//blog api end

// product api start
app.use("/api/product/parentcategory", parentCategoryRoute);
app.use("/api/customized", categoryCustomizedRoute);
app.use("/api/product/category", productCategoryRoute);
app.use("/api/product/subcategory", productSubCategoryRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/store", storeRoute);
app.use("/api/product", productRoute);
// prodcut api end

// address api start
app.use("/api/address", addressRouter);

//media api start
app.use("/api/upload", mediaRoute);

//media api end

// profile api start
app.use("/api/profile", profileRouter);

//auth api
app.use("/api/auth", userAuth);

// wishlist and cart api
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishListRouter);

// user api
app.use("/api/user", userRouter);

// checkout api
app.use("/api/checkout", checkoutRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
