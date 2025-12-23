const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createClass,
  joinClass,
  myClasses,
} = require("../controllers/classroomController");

// Create Classroom (Teacher Only)
router.post("/create", auth, createClass);

// Join Classroom (Students)
router.post("/join", auth, joinClass);

// Get My Classrooms
router.get("/my", auth, myClasses);

module.exports = router;

