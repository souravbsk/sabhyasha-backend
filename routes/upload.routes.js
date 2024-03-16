module.exports = (app) => {
    const uploadController = require("../controllers/upload.controller.js");
    const router = require("express").Router();

    router.post("/", uploadController.uploadFile);


    app.use("/api/upload", router);
};


