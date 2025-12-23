const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
      index: true
    },

    title: { type: String, required: true },

    message: { type: String, required: true },

    type: { 
      type: String, 
      enum: ["assignment", "classroom", "grade", "system"],
      default: "system" 
    },

    read: { type: Boolean, default: false },

    deleted: { type: Boolean, default: false } // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
