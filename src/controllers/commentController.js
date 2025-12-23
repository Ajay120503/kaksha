const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { postId, text, parentComment } = req.body;

    if (!text) return res.status(400).json({ msg: "Comment cannot be empty" });

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ msg: "Invalid Post ID" });
    }

    // Validate parentComment if provided
    if (parentComment && !mongoose.Types.ObjectId.isValid(parentComment)) {
      return res.status(400).json({ msg: "Invalid Parent Comment ID" });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      text,
      parentComment: parentComment || null,
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    // Emit Socket.io event if set
    const io = req.app.get("socketio");
    if (io) io.to(postId).emit("refreshComments");

    res.status(201).json(comment);
  } catch (err) {
    console.error("Add Comment Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Get Comments of a Post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ msg: "Invalid Post ID" });
    }

    const comments = await Comment.find({ post: postId })
      .populate("author", "name email role")
      .populate("parentComment")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error("Get Comments Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Delete Comment (Owner or Teacher Only)
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Comment ID" });
    }

    const comment = await Comment.findById(id).populate("author");

    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // Allow delete if user wrote it or is a teacher
    if (
      comment.author._id.toString() !== req.user._id.toString() &&
      req.user.role !== "teacher"
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await Comment.findByIdAndDelete(id);
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    res.json({ msg: "Comment deleted" });
  } catch (err) {
    console.error("Delete Comment Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
