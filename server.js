require("dotenv").config();
const http = require("http");
// const { Server } = require("socket.io");

const app = require("./src/app");
const connectDB = require("./src/config/db");
// const setupSocket = require("./src/socket");

connectDB();

// HTTP Server
const server = http.createServer(app);

// // SOCKET.IO
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// Setup Socket Logic
// setupSocket(io);

// Attach IO globally if needed
// app.set("socketio", io);

// SERVER START
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
