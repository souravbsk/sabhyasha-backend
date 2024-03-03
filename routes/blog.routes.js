module.exports = (app) => {
    const blogController = require("../controllers/blog.controller");
    const router = require("express").Router();
  
    router.post("/create", blogController.createBlog);
    router.get("/", blogController.getAllBlogs);
    router.get("/:blogId", blogController.getBlogById);
    router.delete("/:blogId", blogController.deleteBlog);
  
    
    app.use("/api/blog", router);
  };
  

