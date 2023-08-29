const mongoose = require("mongoose");
const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  file: {
    type: String,
  },
  tags: {
    type: String,
  },
  comments: [{
    type: mongoose.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Post", PostSchema);
