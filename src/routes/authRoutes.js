const router = require("express").Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get logged user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
