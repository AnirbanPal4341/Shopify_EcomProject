const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: true },
  brand: { type: String, required: true },
  material: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: String, required: true },
  availability: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

});

module.exports = mongoose.model("Post", postSchema);
