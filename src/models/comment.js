let mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
    },
    /* postId: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    }, */
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      default: [],
    },
    replies: {
      type: [mongoose.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
//CommentSchema.index({ postId: 1, userId: 1 }, { unique: false });

const Comment = mongoose.model("comment", CommentSchema);
module.exports = Comment;
