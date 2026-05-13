import mongoose from "mongoose";

const lastMessageSchema = new mongoose.Schema(
  {
    _id: String,
    content: {
      type: String,
      default: null,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);
const participantSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    joinedAt: { type: Date, default: Date.now() },
  },
  {
    _id: false,
  },
);
const groupSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupAvatarUrl: { type: String },
  },
  {
    _id: false,
  },
);
const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },

    participants: {
      type: [participantSchema],
      required: true,
    },

    // GROUP ONLY
    group: {
      type: groupSchema,
    },

    description: {
      type: String,
      default: "",
    },
    lastMessageAt: Date,
    lastMessage: {
      type: lastMessageSchema,
      default: null,
    },

    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    unReadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true },
);

conversationSchema.index({
  "participants.userId": 1,
  lastMessageAt: -1,
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
