const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  deleteJoinRequest,
} = require("../controllers/classJoinRequestController");

router.get("/", auth, getJoinRequests);
router.patch("/approve/:id", auth, approveJoinRequest);
router.patch("/reject/:id", auth, rejectJoinRequest);
router.delete("/:id", auth, deleteJoinRequest);

module.exports = router;