const { ObjectId } = require("mongodb");
const collections = require("../Utility/collections");
const { getSabhyashadb } = require("../Utility/db");
const uploadImage = require("../middleware/imageUploadMiddleware");


exports.createBlog = async (req, res) => {
  try {
    const { title, content, author, category, tags, images } = req.body;
    const createdAt = new Date();

    // Check if the 'images' field is present and is an array
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Images field must be an array' });
    }

    const imageURLs = await uploadImage(images);

    const sabhyashadb = getSabhyashadb();
    const blogPostCollection = sabhyashadb.collection(collections.blogPosts);

    const insertedBlogPost = await blogPostCollection.insertOne({
      title,
      content,
      author,
      category,
      tags,
      imageURLs,
      createdAt
    });

    if (!insertedBlogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    return res.status(201).json({
      message: "Blog post created successfully",
      data: insertedBlogPost
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

  // Function to get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const sabhyashadb = getSabhyashadb();
        const blogPostCollection = sabhyashadb.collection(collections.blogPosts);

        const blogs = await blogPostCollection.find({}).toArray();
        res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Function to get one blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const sabhyashadb = getSabhyashadb();
        const blogPostCollection = sabhyashadb.collection(collections.blogPosts);

        const blog = await blogPostCollection.findOne({ _id: new ObjectId(id) });
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Function to delete a blog by ID
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const sabhyashadb = getSabhyashadb();
        const blogPostCollection = sabhyashadb.collection(collections.blogPosts);

        const result = await blogPostCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
