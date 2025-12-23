const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const Classroom = require("../models/Classroom");

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, file } = req.body;

    if (!assignmentId || !file)
      return res.status(400).json({ msg: "Assignment ID and file are required" });

    if (!mongoose.Types.ObjectId.isValid(assignmentId))
      return res.status(400).json({ msg: "Invalid Assignment ID" });

    // Check assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment)
      return res.status(404).json({ msg: "Assignment not found" });

    // Prevent multiple submissions by same student
    const already = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id
    });

    if (already)
      return res.status(400).json({ msg: "Already submitted!" });

    const sub = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      file
    });

    res.status(201).json(sub);
  } catch (err) {
    console.error("Submit Assignment Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};


exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Submission ID" });

    // Must be teacher
    if (req.user.role !== "teacher")
      return res.status(403).json({ msg: "Only teacher can grade" });

    const submission = await Submission.findById(id).populate("assignment");

    if (!submission)
      return res.status(404).json({ msg: "Submission not found" });

    // Ensure teacher owns that classroom
    const classroom = await Classroom.findById(
      submission.assignment.classroom
    );

    if (!classroom)
      return res.status(404).json({ msg: "Classroom not found" });

    if (classroom.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ msg: "You are not class teacher" });

    const updated = await Submission.findByIdAndUpdate(
      id,
      { marks, feedback },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Grade Submission Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
