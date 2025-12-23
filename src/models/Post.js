const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }, // links post to a classroom
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // author of the post
    text: String, // post text
    attachments: [String], // optional attachments: images/audio/pdf/etc.
    commentsCount: { type: Number, default: 0 }, // used to track number of comments
  },
  { timestamps: true } // auto-createdAt and updatedAt
);

module.exports = mongoose.model("Post", postSchema);
