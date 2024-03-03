const cloudinary = require('cloudinary').v2;
require('dotenv').config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDAPISECRET
});
const uploadImage = async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
  
      const { files } = req;
      const imageURLs = [];
  
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageURLs.push(result.secure_url);
      }
  
      req.imageURLs = imageURLs;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload image(s) to Cloudinary' });
    }
  };
  
  module.exports = uploadImage;
  