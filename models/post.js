const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    richDescription: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
    image: { type: String, required: true },
    isFeatured: { type: Boolean, required: true, default: false },
    // images: [{ type: String }],
  },
  { timestamps: true }
);

postSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

postSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Post", postSchema);
