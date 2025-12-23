const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createAssignment,
  getAssignments,
} = require("../controllers/assignmentController");

// Teacher Creates Assignment
router.post("/create", auth, createAssignment);

// Get Assignments of Classroom
router.get("/:classId", auth, getAssignments);

module.exports = router;
