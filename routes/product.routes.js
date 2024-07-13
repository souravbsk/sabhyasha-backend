const {
  createProduct,
  getAllProducts,
  quickUpdateProductById,
  bulkUploadProducts,
  deleteProductById,
  showProducts,
  viewProduct,
  searchByProductName,
  getDeatailedProductCountByCategoryWise,
  filterProducts,
  pushProductIntoNotified,
  getInfoOfNotifiedProducts,
  popProductFromNotifications,
} = require("../controllers/product.controllers.js");

const productRoute = require("express").Router();
const upload = require("multer")();

productRoute.post(
  "/admin/products/bulk-upload",
  upload.any(),
  bulkUploadProducts
); // create blog category
productRoute.post("/admin/create", upload.any(), createProduct); // create blog category
productRoute.get("/admin/products", getAllProducts); // view all blogs
productRoute.put(
  "/admin/product/quick-update/:productId",
  quickUpdateProductById
);
productRoute.delete("/admin/product/:productId", deleteProductById);

// user viewing product
productRoute.get("/user/products", showProducts);
productRoute.get("/user/product/:productId", viewProduct);

// filter search product
productRoute.get("/search-products", searchByProductName);

//   productCategoryRoute.get("/:parentcategoryId", getAllProductCategoryById);
// getCount of products by category, subcategory, parentcategory
productRoute.get(
  "/user/products/detailedcount",
  getDeatailedProductCountByCategoryWise
);

// get products by filter
productRoute.put("/filter", filterProducts);

// product notification routes
productRoute.post("/notification/:productId", pushProductIntoNotified);
productRoute.get("/notification", getInfoOfNotifiedProducts);
productRoute.delete("/notification/:productId", popProductFromNotifications);

//   productCategoryRoute.get("/:parentcategoryId", getAllProductCategoryById); // remove blog

module.exports = { productRoute };
