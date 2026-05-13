import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    url: String,

    publicId: String,

    fileName: String,

    fileSize: Number,

    mimeType: String,

    type: {
      type: String,
      enum: ["image", "video", "file", "audio"],
    },
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      trim: true,
    },

    attachments: [attachmentSchema],

    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        emoji: String,
      },
    ],
  },
  { timestamps: true },
);

messageSchema.index({
  conversation: 1,
  createdAt: 1,
});
const Message = mongoose.model("Message", messageSchema);

export default Message;
