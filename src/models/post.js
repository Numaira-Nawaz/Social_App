let mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    comments: {
      type: [mongoose.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
    likes: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
