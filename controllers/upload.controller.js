const uploadToS3 = require("../middleware/uploadToS3"); // Import the middleware
require('dotenv').config();

exports.uploadFile = async (req, res) => {
    try {
        const imageURLs = await uploadToS3("BlogContent")(req, res, async () => {
            try {

                console.log(req.fileUrls)

                const uploadUrl = {
                    imageURLs: req.fileUrls[0],

                }
                console.log(uploadUrl)


                return res.status(201).json({
                    success: true,
                    message: "Blog post created successfully",
                    data: uploadUrl
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        });

        // Handle any errors from the middleware
        if (imageURLs instanceof Error) {
            throw imageURLs;
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};