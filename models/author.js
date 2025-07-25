const mongoose = require("mongoose");
const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    description: { type: String, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

authorSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

authorSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Author", authorSchema);
