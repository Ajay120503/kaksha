const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
} = require("../controllers/postController");

// Create Post for Classroom
router.post("/class/:classId", auth, createPost);

// Get Classroom Posts
router.get("/class/:classId", auth, getPosts);

module.exports = router;
