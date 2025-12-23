const Notification = require("../models/Notification");

let ioInstance = null;

// Called once from server.js
const registerSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // User sends their ID after login
    socket.on("register", (userId) => {
      socket.join(userId.toString());
      console.log("User joined room:", userId);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  });
};

const sendNotification = async ({ userId, title, message, type = "system" }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type
    });

    if (ioInstance) {
      ioInstance.to(userId.toString()).emit("notification", notification);
    }

    return notification;
  } catch (error) {
    console.log("Notification Error:", error.message);
  }
};

module.exports = { sendNotification, registerSocket };
