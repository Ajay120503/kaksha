require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const http = require("http");
const { Server } = require("socket.io");
const { registerSocket } = require("./src/utils/sendNotification");

connectDB();

// HTTP Server
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ================= SOCKET LOGIC =================
io.on("connection", (socket) => {
  console.log("🟢 Socket Connected:", socket.id);

  // ---- USER REGISTERS SOCKET (For Notifications) ----
  socket.on("registerUser", (userId) => {
    socket.join(userId.toString());
    console.log(`User Joined Personal Room: ${userId}`);
  });

  // ---- CLASSROOM ROOMS ----
  socket.on("joinClass", (classId) => {
    socket.join(classId);
    console.log(`User joined Class Room: ${classId}`);
  });

  // ---- POST & COMMENT EVENTS ----
  socket.on("newPost", (classId) => {
    io.to(classId).emit("refreshPosts");
  });

  socket.on("commentAdded", (postId) => {
    socket.join(postId);
    io.to(postId).emit("refreshComments");
  });

  // ---- ASSIGNMENT EVENTS ----
  socket.on("assignmentAdded", (classId) => {
    io.to(classId).emit("refreshAssignments");
  });

  // ---- SUBMISSION EVENTS ----
  socket.on("submissionAdded", (assignmentId) => {
    io.to(assignmentId).emit("refreshSubmissions");
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket Disconnected");
  });
});

// Register Notification IO Instance
registerSocket(io);

// Attach IO globally if needed in controllers
app.set("socketio", io);

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
