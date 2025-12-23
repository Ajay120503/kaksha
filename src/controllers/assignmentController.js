const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const Classroom = require("../models/Classroom");

exports.createAssignment = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Only teacher can create assignments" });
    }

    const { classId, title, description, deadline, maxMarks, attachments } = req.body;

    if (!classId || !title)
      return res.status(400).json({ msg: "Class ID and Title are required" });

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(classId))
      return res.status(400).json({ msg: "Invalid Classroom ID" });

    // Check classroom exists & teacher owns it
    const classroom = await Classroom.findById(classId);

    if (!classroom)
      return res.status(404).json({ msg: "Classroom not found" });

    if (classroom.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ msg: "You are not the teacher of this class" });

    const assignment = await Assignment.create({
      classroom: classId,
      title,
      description,
      deadline,
      maxMarks,
      attachments
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error("Create Assignment Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};


exports.getAssignments = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ msg: "Invalid Classroom ID" });
    }

    const assignments = await Assignment.find({ classroom: classId })
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (err) {
    console.error("Get Assignments Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
