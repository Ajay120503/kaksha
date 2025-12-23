const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

// Example notification model (create if exists)
const Notification = require("../models/Notification");

// Get logged-in user's notifications
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
