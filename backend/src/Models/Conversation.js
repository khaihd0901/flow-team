import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["private", "group"],
      default: "private",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // GROUP ONLY
    groupName: {
      type: String,
      trim: true,
    },

    groupAvatar: {
      type: String,
      default: "",
    },

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    description: {
      type: String,
      default: "",
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true },
);

conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema,
);

export default Conversation;