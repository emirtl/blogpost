const mongoose = require("mongoose");
const authSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address format",
      },
    },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    // owner: { type: Boolean, default: false },
  },
  { timestamps: true }
);

authSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

authSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("User", authSchema);
