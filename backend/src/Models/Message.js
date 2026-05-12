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
      enum: [
        "image",
        "video",
        "file",
        "audio",
      ],
    },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
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

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model(
  "Message",
  messageSchema
);

export default Message;