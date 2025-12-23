const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  submitAssignment,
  gradeSubmission,
} = require("../controllers/submissionController");

// Student submits assignment
router.post("/submit", auth, submitAssignment);

// Teacher grades submission
router.put("/grade/:id", auth, gradeSubmission);

module.exports = router;
