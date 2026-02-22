const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const Classroom = require("../models/Classroom");
const { cosineSimilarity } = require("../utils/plagiarism");
const { extractTextFromFile } = require("../utils/fileExtractor.js");
const { createNotification } = require("../utils/notification");

// Student submits assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, fileUrl, fileType } = req.body;

    if (!assignmentId || (!fileUrl)) {
      return res
        .status(400)
        .json({ msg: "Assignment ID and submission content required" });
    }

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ msg: "Invalid Assignment ID" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    const extractedText = fileUrl
      ? await extractTextFromFile(fileUrl, fileType)
      : "";
    
    console.log("ExtractedText TYPE:", typeof extractedText);
    console.log("Extracted Text Length:", extractedText.length); 

    // 🔎 Check if student already submitted
    const existing = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });

    // 🔍 Get previous submissions (excluding current student)
    const previousSubmissions = await Submission.find({
      assignment: assignmentId,
      student: { $ne: req.user._id },
    }).populate("student");

    let highestScore = 0;
    let matchedWith = [];

    for (const sub of previousSubmissions) {
      if (!sub.extractedText || !extractedText) continue;

      const score = cosineSimilarity(extractedText, sub.extractedText);

      if (score >= 30) {
        matchedWith.push({
          student: sub.student._id,
          similarity: score,
        });

        highestScore = Math.max(highestScore, score);
      }
    }

    /* ================= RESUBMISSION ================= */
    if (existing) {
      if (existing.marks !== undefined && existing.marks !== null) {
        return res
          .status(400)
          .json({ msg: "Assignment already graded. Cannot resubmit." });
      }

      const isLate = new Date() > new Date(assignment.deadline);

      existing.file = fileUrl || existing.file;
      existing.extractedText = extractedText || existing.extractedText;
      existing.resubmitted = true;
      existing.submittedAt = new Date();
      existing.isLate =
        new Date(existing.submittedAt) >
        new Date(assignment.deadline);

      existing.plagiarism = {
        score: highestScore,
        matchedWith,
        flagged: highestScore > 40,
      };

      await existing.save();
      return res.json(existing);
    }

    /* ================= FIRST SUBMISSION ================= */
    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      file: fileUrl,
      extractedText: extractedText,
      submittedAt: new Date(),
      isLate:
        assignment.deadline &&
        Date.now() > new Date(assignment.deadline).getTime(),
      plagiarism: {
        score: highestScore,
        matchedWith,
        flagged: highestScore > 40,
      },
    });

    const classroom = await Classroom.findById(assignment.classroom);

    await createNotification({
      title: "New Submission",
      message: `${req.user.name} submitted an assignment in "${classroom.name}".`,
      users: [classroom.teacher],
      role: "teacher",
      createdBy: req.user._id,
      type: "submission",
      link: `/assignment/submission/${assignment._id}`,
    });

    console.log({
      fileUrl,
      extractedTextPreview: extractedText.substring(0, 100),
    });

    res.status(201).json(submission);
  } catch (err) {
    console.error("Submit Assignment Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Teacher grades a submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid Submission ID" });

    if (req.user.role !== "teacher")
      return res.status(403).json({ msg: "Only teachers can grade submissions" });

    const submission = await Submission.findById(id).populate("assignment");

    if (!submission)
      return res.status(404).json({ msg: "Submission not found" });

    const classroom = await Classroom.findById(submission.assignment.classroom);

    if (!classroom)
      return res.status(404).json({ msg: "Classroom not found" });

    if (classroom.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ msg: "You are not the teacher of this class" });

    if (submission.plagiarism?.flagged) {
      return res.status(400).json({
        msg: "Plagiarism detected. Resolve before grading.",
      });
    }

    submission.marks = grade;
    submission.feedback = feedback;
    submission.resubmitted = false;
    await submission.save();

    await createNotification({
      title: "Assignment Graded",
      message: `Your assignment has been graded in "${classroom.name}".`,
      users: [submission.student],
      role: "student",
      createdBy: req.user._id,
      type: "assignment",
      link: `/assignment/submission/${submission.assignment._id}`,
    });

    res.json(submission);
  } catch (err) {
    console.error("Grade Submission Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Get student's submission
exports.getMySubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId))
      return res.status(400).json({ msg: "Invalid Assignment ID" });

    const submission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });

    res.json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Teacher: get all submissions for an assignment
exports.getAllSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId))
      return res.status(400).json({ msg: "Invalid Assignment ID" });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment)
      return res.status(404).json({ msg: "Assignment not found" });

    const classroom = await Classroom.findById(assignment.classroom);
    if (!classroom)
      return res.status(404).json({ msg: "Classroom not found" });

    if (classroom.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ msg: "You are not the teacher of this class" });

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email")
      .populate("plagiarism.matchedWith.student", "name email")
      .select("student plagiarism marks submittedAt file isLate");

    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
