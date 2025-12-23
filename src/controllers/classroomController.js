const Classroom = require("../models/Classroom");
const User = require("../models/User");
const generateCode = require("../utils/generateCode");

exports.createClass = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Only teacher can create class" });
    }

    let code;
    let existing;

    do {
      code = generateCode();
      existing = await Classroom.findOne({ code });
    } while (existing);

    const { name, description } = req.body;

    if (!name) return res.status(400).json({ msg: "Class name is required" });

    const classroom = await Classroom.create({
      name,
      description,
      code,
      teacher: req.user._id
    });

    req.user.classroomsOwned.push(classroom._id);
    await req.user.save();

    res.status(201).json(classroom);
  } catch (err) {
    console.error("Create Class Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};


exports.joinClass = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) return res.status(400).json({ msg: "Code is required" });

    const classroom = await Classroom.findOne({ code });

    if (!classroom)
      return res.status(404).json({ msg: "Invalid classroom code" });

    // Prevent teacher joining their own class
    if (classroom.teacher.toString() === req.user._id.toString()) {
      return res.json({ msg: "Teacher already owns this class" });
    }

    // Prevent duplicate joining
    const alreadyJoined = classroom.students.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyJoined)
      return res.json({ msg: "Already joined", classroom });

    classroom.students.push(req.user._id);
    await classroom.save();

    res.json({ msg: "Joined successfully", classroom });
  } catch (err) {
    console.error("Join Class Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};


exports.myClasses = async (req, res) => {
  try {
    const classes = await Classroom.find({
      $or: [
        { teacher: req.user._id },
        { students: req.user._id }
      ]
    }).populate("teacher students", "name email role");

    res.json(classes);
  } catch (err) {
    console.error("My Classes Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
