const { ObjectId } = require("mongodb");
const collections = require("../Utility/collections");
const { getSabhyashadb } = require("../Utility/db");
const uploadToS3 = require("../middleware/uploadToS3"); // Import the middleware
const slugGenerate = require("../middleware/slugGenerate");
const { default: slugify } = require("slugify");
require('dotenv').config();



exports.createBlog = async (req, res) => {
  console.log(req)
  try {
    const { title, description, author, category, tags, featureImgAlt, featureImageDescription } = req.body;
    const tagsArray = tags ? tags.split(",") : [];
    const createdAt = new Date();
    const imageURLs = await uploadToS3("Blog")(req, res, async () => {
      try {
        const sabhyashadb = getSabhyashadb();
        const blogPostCollection = sabhyashadb.collection(collections.blogPosts);
        const featureImage = {
          imageURL: req.fileUrls[0],
          featureImgAlt,
          featureImageDescription,
        }

        const generateSlugUrl = await slugGenerate(title, blogPostCollection);


        const newBlog = {
          title,
          description,
          author,
          category,
          tags: tagsArray,
          featureImage,
          createdAt,
          slug: generateSlugUrl // Use the generated (or modified) slug
        }
        console.log(newBlog)

        const insertedBlogPost = await blogPostCollection.insertOne(newBlog);


        if (!insertedBlogPost) {
          return res.status(404).json({ error: "Blog post not found" });
        }

        return res.status(201).json({
          message: "Blog post created successfully",
          data: insertedBlogPost
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};






// Update blog by ID
exports.updateBlogById = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, slug, category, description, tags, author, featureImgAlt, featureImageDescription, image, } = req.body;
    const tagsArray = tags ? tags.split(",") : [];
    const updatedAt = new Date();

    const sabhyashadb = getSabhyashadb();
    const blogPostCollection = sabhyashadb.collection(collections.blogPosts);
    let imageURL;
    if (image) {
      imageURL = image
    }
    else {
      const imageURLs = await uploadToS3("Blog")(req, res);
      imageURL = req.fileUrls[0]
    }
    let generateSlugUrl = await slugify(slug, {
      replacement: '-',
      lower: true,
      strict: false,
    });
    const existingBlogs = await blogPostCollection.find({ slug: generateSlugUrl }).toArray();
    if (existingBlogs.length > 1) {
      return res.status(400).json({ error: "Blog with the same slug already exists" });
    }


    const featureImage = {
      imageURL: imageURL,
      featureImgAlt,
      featureImageDescription,
    }

    const modifyBlog = {
      title,
      description,
      author,
      category,
      tags: tagsArray,
      featureImage,
      updatedAt,
      slug: generateSlugUrl
    }

    const result = await blogPostCollection.updateOne(
      { _id: new ObjectId(blogId) },
      { $set: modifyBlog }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: result
    });

    console.log(existingBlogs, "fds")

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




// Function to get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const sabhyashadb = getSabhyashadb();
    const blogPostCollection = sabhyashadb.collection(collections.blogPosts);
    const blogCategoryCollection = sabhyashadb.collection(collections.categories);
    const blogs = await blogPostCollection.find({}).toArray();
    const categories = await blogCategoryCollection.find({}).toArray();
    const categoryMap = new Map();
    categories.forEach(category => {
      categoryMap.set(category._id.toString(), {
        id: category?._id,
        name: category.name,
        slug: category.slug,
        createdAt: category?.createdAt
      });
    });
    const blogsWithCategoryNames = await Promise.all(blogs.map(async (blog) => {

      return {
        ...blog,
        category: categoryMap.get(blog.category.toString()) || 'Uncategorized'
      };
    }));

    res.status(200).json(blogsWithCategoryNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Function to get one blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const { slug } = req.params;

    const sabhyashadb = getSabhyashadb();
    const blogPostCollection = sabhyashadb.collection(collections.blogPosts);
    const blogCategoryCollection = sabhyashadb.collection(collections.categories);

    const blog = await blogPostCollection.findOne({ slug: slug });
    const CategoryId = await blog?.category;
    const blogCategory = await blogCategoryCollection.findOne({ _id: new ObjectId(CategoryId) });
    blog.category = await blogCategory

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
    const { blogId } = req.params;
    console.log(blogId)
    const sabhyashadb = getSabhyashadb();
    const blogPostCollection = sabhyashadb.collection(collections.blogPosts);

    const result = await blogPostCollection.deleteOne({ _id: new ObjectId(blogId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({
      message: "Blog deleted successfully",
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




// _____________________________________________
// get blog base on category


// Function to get all blogs By Category
exports.getBlogByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const sabhyashadb = getSabhyashadb();
    const blogPostCollection = sabhyashadb.collection(collections.blogPosts);
    const blogCategoryCollection = sabhyashadb.collection(collections.categories);

    const categoryData = await blogCategoryCollection.findOne({ slug: slug });

    if (categoryData) {
      const queryBlog = { category: categoryData?._id.toString() }
      const blogs = await blogPostCollection.find(queryBlog).toArray();

      const blogsWithData = blogs.map(blog => {
        return {
          ...blog,
          category: categoryData || { _id: null, name: "Uncategorized", slug: "uncategorized" }
        };

      });
      res.status(200).json(blogsWithData);


    }
    else {
      const blogs = await blogPostCollection.find({}).toArray();
      const blogsWithData = blogs.map(blog => {
        return {
          ...blog,
          category: categoryData || { _id: null, name: "Uncategorized", slug: "uncategorized" }
        };

      });
      res.status(200).json(blogsWithData);
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};