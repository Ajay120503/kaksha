const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/classroom", require("./routes/classroomRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/materials", require("./routes/materialRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  if (err instanceof multer.MulterError)
    return res.status(400).json({ message: err.message });

  if (err.message === "Invalid file type")
    return res
      .status(400)
      .json({ message: "Only Images, Audio, PDF, DOC, PPT allowed" });

  res.status(500).json({
    message: "Server Error",
    error: err.message
  });
});

module.exports = app;
