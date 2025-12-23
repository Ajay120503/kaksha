const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { classId } = req.params;

    if (!classId || !text)
      return res.status(400).json({ msg: "Class and text are required" });

    const post = await Post.create({
      classroom: classId,
      text,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Create Post Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Get Posts of a Classroom
exports.getPosts = async (req, res) => {
  try {
    const { classId } = req.params;

    const posts = await Post.find({ classroom: classId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get Posts Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
