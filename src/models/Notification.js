const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    recipients: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["student", "teacher", "admin"],
          required: true,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [
        "assignment",
        "classroom",
        "announcement",
        "submission",
        "system",
        "general",
        "material",
        "post",
        "comment"

      ],
      default: "general",
    },

    link: {
      type: String,
      required: true,
      default: "/notifications",
    },
  },
  { timestamps: true }
);

notificationSchema.index({ "recipients.user": 1 });

module.exports = mongoose.model("Notification", notificationSchema);