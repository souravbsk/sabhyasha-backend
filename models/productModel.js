const { default: mongoose } = require("mongoose");

const productModel = new mongoose.Schema({
  name: String,
  short_description: String,
  description: String,
  isCustomizable: Boolean,
  parent_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productParentCategory",
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
  },
  subcategory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  hsnCode: Number,
  store_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stores",
  },
  tax_rate: Number,
  image: {
    imageUrl: String,
  },
  tags: [String],
  meta_title: String,
  meta_keyword: String,
  meta_description: String,
  date_available: Date,
  dispatch_in_days: Number,
  quantity: Number,
  sort_order: Number,
  maximum_order: Number,
  minimum_order: Number,
  height: Number,
  height_after_package: Number,
  weight: Number,
  weight_after_package: Number,
  width: Number,
  width_after_package: Number,
  length: Number,
  length_after_package: Number,
  returnable: Boolean,
  cancellable: Boolean,
  available_for_cod: Boolean,
  seller_pickup_return: Boolean,
  return_window: Number,
  price: Number,
  discount: Number,
  is_shipping_cost_included: Boolean,
  additional_shipping_cost: Number,
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  view_count: Number,
  productGalleryImageUrls: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

productModel.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productModel);

module.exports = {
  Product,
};
