// // src/socket.js
// const { registerSocket } = require("./utils/sendNotification.js");

// function setupSocket(io) {
//   io.on("connection", (socket) => {
//     console.log("🟢 Socket Connected:", socket.id);

//     // ---- USER REGISTRATION ----
//     socket.on("registerUser", (userId) => {
//       socket.join(userId.toString());
//       console.log(`User Joined Personal Room: ${userId}`);
//     });

//     // ---- CLASSROOM ROOMS ----
//     socket.on("joinClass", (classId) => {
//       socket.join(classId);
//       console.log(`User joined Class Room: ${classId}`);
//     });

//     // ---- POST & COMMENTS ----
//     socket.on("newPost", (classId) => {
//       io.to(classId).emit("refreshPosts");
//     });

//     socket.on("commentAdded", (postId) => {
//       socket.join(postId);
//       io.to(postId).emit("refreshComments");
//     });

//     // ---- ASSIGNMENTS ----
//     socket.on("assignmentAdded", (classId) => {
//       io.to(classId).emit("refreshAssignments");
//     });

//     // ---- SUBMISSIONS ----
//     socket.on("submissionAdded", (assignmentId) => {
//       io.to(assignmentId).emit("refreshSubmissions");
//     });

//     socket.on("disconnect", () => {
//       console.log("🔴 Socket Disconnected");
//     });
//   });

//   // Register Notification IO Instance
//   registerSocket(io);
// }

// module.exports = setupSocket;
