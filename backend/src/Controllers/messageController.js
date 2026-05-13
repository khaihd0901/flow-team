import asyncHandler from "express-async-handler";
import Message from "../Models/Message.js";
import Conversation from "../Models/Conversation.js";
import cloudinary from "../Configs/cloudinaryConfig.js";
import { io } from '../socket/index.js';
import { emitMessage,updateConversationAfterCreateMessage } from "../Utils/messageHelper.js";
// ==========================================
// SEND MESSAGE
// Supports:
// - private chat
// - group chat
// - text
// - image
// - video
// - file
// ==========================================
export const sendDirectMessage = asyncHandler(async (req, res) => {
  try {
    const senderId = req.user._id;

    const { recipientId, content,conversationId } = req.body;
    const files = req.files || [];

    
    // ==========================================
    // HANDLE FILE UPLOADS
    // ==========================================
    const attachments = [];

    for (const file of files) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: "flowteam/messages",
      });

      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload attachment",
        });
      }

      // detect file type
      let type = "file";

      if (file.mimetype.startsWith("image/")) {
        type = "image";
      } else if (file.mimetype.startsWith("video/")) {
        type = "video";
      } else if (file.mimetype.startsWith("audio/")) {
        type = "audio";
      }

      attachments.push({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        type,
      });
    }

    let conversation;

    if(!content) {
      return res.status(400).json({message: "Missing Content"})
    }
    if(conversationId){
      conversation = await Conversation.findById(conversationId)
    }
    if(!conversation){
      conversation = await Conversation.create({
        type: "direct",
        participants:[
          {userId: senderId, joinedAt: new Date()},
          {userId: recipientId, joinedAt: new Date()},
        ],
        lastMessageAt: new Date(),
        unReadCounts: new Map()
      })
    }
    // ==========================================
    // CREATE MESSAGE
    // ==========================================
    const message = await Message.create({
      conversationId: conversationId,
      senderId,
      content,
      attachments,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();
    return res.status(201).json({
      message
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
export const sendGroupMessage = asyncHandler(async (req, res) => {
  try {
    const senderId = req.user._id;

    const { conversationId, content } = req.body;
    const files = req.files || [];

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // ==========================================
    // CHECK PARTICIPANT
    // ==========================================
    const isParticipant = conversation.participants.some(
      (participant) => participant.userId.toString() === senderId.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant of this conversation",
      });
    }

    // ==========================================
    // HANDLE FILE UPLOADS
    // ==========================================
    const attachments = [];

    for (const file of files) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: "flowteam/messages",
      });

      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload attachment",
        });
      }

      // detect file type
      let type = "file";

      if (file.mimetype.startsWith("image/")) {
        type = "image";
      } else if (file.mimetype.startsWith("video/")) {
        type = "video";
      } else if (file.mimetype.startsWith("audio/")) {
        type = "audio";
      }

      attachments.push({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        type,
      });
    }

    // ==========================================
    // VALIDATE EMPTY MESSAGE
    // ==========================================
    if (!content?.trim() && attachments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    // ==========================================
    // CREATE MESSAGE
    // ==========================================
    const message = await Message.create({
      conversationId,
      senderId,
      content,
      attachments
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();

    return res.status(201).json({message});
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// ==========================================
// GET MESSAGES OF CONVERSATION
// ==========================================
export const getMessagesByConversation = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { conversationId } = req.params;
    const limit = Number(req.query.limit) || 50;
    const cursor = req.query.cursor;

    // ==========================================
    // VALIDATE CONVERSATION
    // ==========================================
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // ==========================================
    // CHECK PARTICIPANT
    // ==========================================
    const isParticipant = conversation.participants.some(
      (participant) => participant.userId.toString() === userId.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this conversation",
      });
    }

    // ==========================================
    // BUILD QUERY
    // ==========================================
    const query = {
      conversationId: conversationId,
    };

    // load older messages
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    // ==========================================
    // GET MESSAGES
    // ==========================================
    let messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1);

    // check if more messages exist
    let nextCursor = null;

    if(messages.length > Number(limit)){
      const nextMessage = messages[messages.length -1];
      nextCursor = nextMessage.createdAt.toISOString();
      messages.pop();
    }

    // reverse for chat UI
    messages = messages.reverse();
    

    return res.status(200).json({messages,nextCursor});
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================================
// MARK MESSAGE AS READ
// ==========================================
export const markMessageAsRead = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // avoid duplicate read
    const alreadyRead = message.readBy.some(
      (reader) => reader.toString() === userId.toString(),
    );

    if (!alreadyRead) {
      const conversation = await Conversation.findById(message.conversation);

      if (conversation) {
        conversation.unReadCounts.set(userId.toString(), 0);

        await conversation.save();
      }
      message.readBy.push(userId);

      await message.save();
    }

    return res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================================
// DELETE MESSAGE
// ==========================================
export const deleteMessage = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // only sender can delete
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // delete cloudinary files
    if (message.attachments && message.attachments.length > 0) {
      for (const attachment of message.attachments) {
        if (attachment.publicId) {
          await cloudinary.uploader.destroy(attachment.publicId, {
            resource_type: attachment.type === "video" ? "video" : "image",
          });
        }
      }
    }
    const latestMessage = await Message.findOne({
      conversation: message.conversation,
    }).sort({ createdAt: -1 });

    const conversation = await Conversation.findById(message.conversation);

    if (conversation) {
      if (latestMessage) {
        conversation.lastMessage = {
          messageId: latestMessage._id,
          content: latestMessage.content,
          senderId: latestMessage.sender,
          createdAt: latestMessage.createdAt,
        };

        conversation.lastMessageAt = latestMessage.createdAt;
      } else {
        conversation.lastMessage = null;
        conversation.lastMessageAt = null;
      }

      await conversation.save();
    }

    await Message.findByIdAndDelete(messageId);

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================================
// REACT TO MESSAGE
// ==========================================
export const reactToMessage = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { messageId } = req.params;

    const { emoji } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const existingReaction = message.reactions.find(
      (reaction) => reaction.user.toString() === userId.toString(),
    );

    // update existing reaction
    if (existingReaction) {
      existingReaction.emoji = emoji;
    } else {
      // add new reaction
      message.reactions.push({
        user: userId,
        emoji,
      });
    }

    await message.save();

    const populatedMessage = await Message.findById(messageId).populate(
      "reactions.user",
      "fullName avatarUrl",
    );

    return res.status(200).json({
      success: true,
      message: "Reaction updated successfully",
      data: populatedMessage,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
