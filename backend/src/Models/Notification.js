
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "NEW_MESSAGE",
        "FRIEND_REQUEST",
        "FRIEND_ACCEPTED",
        "FRIEND_REJECT",
        "REACTION",
      ],
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });

const Notification = mongoose.model(
  "Notification",
  notificationSchema,
);

export default Notification;

