const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    // Arrays of user IDs guarantee a user can appear at most once,
    // which prevents duplicate likes / reposts / saves.
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Post", postSchema);
