const {
  createBlog,
  getAllBlogs,
  getBlogsByCategory,
  viewBlog,
  removeBlog,
  updateBlogById,
  getBlogById,
  getBlogByCategory,
} = require("../controllers/blog.controllers.js");
const { verifyAdmin } = require("../middlewares/verifyAdmin.js");
const { verifyJwt } = require("../middlewares/verifyJWT.js");

const blogRoute = require("express").Router();
const upload = require("multer")();

blogRoute.post("/create", upload.any(), createBlog); // create blog
blogRoute.get("/",  getAllBlogs); // view all blogs
blogRoute.get("/category/:slug", getBlogByCategory); // get blogs by category
blogRoute.get("/:slug", getBlogById); // get blog by slug
blogRoute.put("/:blogId", upload.any(), updateBlogById); // update blog
blogRoute.delete("/:blogId", removeBlog); // remove blog

module.exports = { blogRoute };
