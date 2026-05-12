import asyncHandler from "express-async-handler";
import Message from "../Models/Message.js";
import Conversation from "../Models/Conversation.js";
import cloudinary from "../Configs/cloudinaryConfig.js";

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
export const sendMessage = asyncHandler(
  async (req, res) => {
    try {
      const senderId = req.user._id;

      const {
        conversationId,
        content,
      } = req.body;

      const files = req.files || [];

      // ==========================================
      // VALIDATE CONVERSATION
      // ==========================================
      const conversation =
        await Conversation.findById(
          conversationId
        );

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      // ==========================================
      // CHECK PARTICIPANT
      // ==========================================
      const isParticipant =
        conversation.participants.some(
          (participant) =>
            participant.toString() ===
            senderId.toString()
        );

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message:
            "You are not a participant of this conversation",
        });
      }

      // ==========================================
      // HANDLE FILE UPLOADS
      // ==========================================
      const attachments = [];

      for (const file of files) {
        const uploadResult =
          await cloudinary.uploader.upload(
            file.path,
            {
              resource_type: "auto",
              folder: "flowteam/messages",
            }
          );

        if (!uploadResult?.secure_url) {
          return res.status(500).json({
            success: false,
            message:
              "Failed to upload attachment",
          });
        }

        // detect file type
        let type = "file";

        if (
          file.mimetype.startsWith("image/")
        ) {
          type = "image";
        } else if (
          file.mimetype.startsWith("video/")
        ) {
          type = "video";
        } else if (
          file.mimetype.startsWith("audio/")
        ) {
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
      if (
        !content?.trim() &&
        attachments.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Message cannot be empty",
        });
      }

      // ==========================================
      // CREATE MESSAGE
      // ==========================================
      const newMessage =
        await Message.create({
          conversation: conversationId,
          sender: senderId,
          content,
          attachments,
          readBy: [senderId],
        });

      // ==========================================
      // UPDATE LAST MESSAGE
      // ==========================================
      conversation.lastMessage =
        newMessage._id;

      await conversation.save();

      // ==========================================
      // POPULATE MESSAGE
      // ==========================================
      const populatedMessage =
        await Message.findById(
          newMessage._id
        )
          .populate(
            "sender",
            "fullName avatarUrl isOnline"
          )
          .populate(
            "readBy",
            "fullName avatarUrl"
          );

      return res.status(201).json({
        success: true,
        message:
          "Message sent successfully",
        data: populatedMessage,
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// ==========================================
// GET MESSAGES OF CONVERSATION
// ==========================================
export const getMessagesByConversation =
  asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const { conversationId } =
        req.params;

      // ==========================================
      // VALIDATE CONVERSATION
      // ==========================================
      const conversation =
        await Conversation.findById(
          conversationId
        );

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      // ==========================================
      // CHECK PARTICIPANT
      // ==========================================
      const isParticipant =
        conversation.participants.some(
          (participant) =>
            participant.toString() ===
            userId.toString()
        );

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message:
            "You are not allowed to access this conversation",
        });
      }

      // ==========================================
      // GET MESSAGES
      // ==========================================
      const messages = await Message.find({
        conversation: conversationId,
      })
        .populate(
          "sender",
          "fullName avatarUrl isOnline"
        )
        .populate(
          "readBy",
          "fullName avatarUrl"
        )
        .sort({ createdAt: 1 });

      return res.status(200).json({
        success: true,
        data: messages,
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
// MARK MESSAGE AS READ
// ==========================================
export const markMessageAsRead =
  asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const { messageId } = req.params;

      const message =
        await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // avoid duplicate read
      const alreadyRead =
        message.readBy.some(
          (reader) =>
            reader.toString() ===
            userId.toString()
        );

      if (!alreadyRead) {
        message.readBy.push(userId);

        await message.save();
      }

      return res.status(200).json({
        success: true,
        message:
          "Message marked as read",
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
export const deleteMessage =
  asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const { messageId } = req.params;

      const message =
        await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // only sender can delete
      if (
        message.sender.toString() !==
        userId.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // delete cloudinary files
      if (
        message.attachments &&
        message.attachments.length > 0
      ) {
        for (const attachment of message.attachments) {
          if (attachment.publicId) {
            await cloudinary.uploader.destroy(
              attachment.publicId,
              {
                resource_type:
                  attachment.type === "video"
                    ? "video"
                    : "image",
              }
            );
          }
        }
      }

      await Message.findByIdAndDelete(
        messageId
      );

      return res.status(200).json({
        success: true,
        message:
          "Message deleted successfully",
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
export const reactToMessage =
  asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;

      const { messageId } = req.params;

      const { emoji } = req.body;

      const message =
        await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      const existingReaction =
        message.reactions.find(
          (reaction) =>
            reaction.user.toString() ===
            userId.toString()
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

      const populatedMessage =
        await Message.findById(messageId)
          .populate(
            "reactions.user",
            "fullName avatarUrl"
          );

      return res.status(200).json({
        success: true,
        message:
          "Reaction updated successfully",
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