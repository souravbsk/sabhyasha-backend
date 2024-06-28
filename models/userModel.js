const { default: mongoose } = require("mongoose");

const userModel = new mongoose.Schema({
  displayName: String,
  password: String,
  email: String,
  avatar: String,
  mobile: String,
  username: String,
  googleId: String,
  shippingAdresses: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "addreses" },
      data: {
        addressType: String,
        name: String,
        city: String,
        slug: String,
        state: String,
        zip: String,
        country: String,
        address: String,
      },
    },
  ],
  productsBought: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

userModel.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const users = mongoose.model("users", userModel, "users");

module.exports = {
  users,
};
