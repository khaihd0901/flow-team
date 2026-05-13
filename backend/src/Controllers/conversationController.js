import asyncHandler from "express-async-handler";
import Conversation from "../Models/Conversation.js";
import Friend from "../Models/Friend.js";
import User from "../Models/User.js";
import { io } from '../socket/index.js';
import { emitMessage,updateConversationAfterCreateMessage } from "../Utils/messageHelper.js";
// ==========================================
// CREATE CONVERSATION
// ==========================================
export const createConversation = asyncHandler(async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { memberIds, type, name } = req.body;

    if (
      !type ||
      (type === "group" && !name) ||
      !memberIds ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Group Name And Member List Are Required" });
    }

    let conversation;
    if (type === "direct") {
      const participantId = memberIds[0];

      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [currentUserId, participantId] },
      });
      // create conversation
      conversation = await Conversation.create({
        type: "direct",
        participants: [{ userId: currentUserId }, { userId: participantId }],
        lastMessageAt: new Date(),
      });
      await conversation.save();
    }
    if (type === "group") {
      // create conversation
      conversation = await Conversation.create({
        type: "group",
        participants: [
          { userId: currentUserId },
          ...memberIds.map((id) => ({ userId: id })),
        ],
        group: {
          name,
        },
        lastMessageAt: new Date(),
      });
      await conversation.save();
    }

    if (!conversation) {
      return res.status(400).json({ message: "Invalid Conversation Type !!!" });
    }
    await conversation.populate([
      {
        path: "participants.userId",
        select: "fullName, avatarUrl",
      },
      {
        path: "seenBy",
        select: "fullName, avatarUrl",
      },
      {
        path: "lastMessage.senderId",
        select: "fullName, avatarUrl",
      },
    ]);
    return res.status(201).json({ conversation });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// ==========================================
// GET USER CONVERSATIONS
// ==========================================
export const getUserConversations = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate({
        path: "participants.userId",
        select: "fullName avatarUrl",
      })
      .populate({
        path: "lastMessage.senderId",
        select: "fullName avatarUrl",
      })
      .populate({
        path: "seenBy",
        select: "fullName avatarUrl",
      });

    const formatted = conversations.map((conversation) => {
      const participants = (conversation.participants || []).map((p) => ({
        _id: p.userId?._id,
        fullName: p.userId?.fullName,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt,
      }));
      return {
        ...conversation.toObject(),
        unReadCounts: conversation.unReadCounts || {},
        participants,
      };
    });

    return res.status(200).json({
      conversations: formatted,
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
export const markConverSationAsSeen = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }
    const last = conversation.lastMessage;
    if (!last) {
      return res.status(200).json({
        success: false,
        message: "Message not exit to mark ass seen",
      });
    }
    if (last.senderId.toString() === userId) {
      return res.status(200).json({
        success: false,
        message: "Sender not need mark ass seen",
      });
    }

    const updated = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: {seenBy: userId},
        $set: {[`unReadCounts.${userId}`]: 0}
      },{
        new: true
      }
    )
    io.to(conversationId).emit("read-message",{
      conversation: updated,
      lastMessage:{
        _id:updated?.lastMessage._id,
        content: updated?.lastMessage.content,
        createdAt: updated?.lastMessage.createdAt,
        sender:{
          _id: updated?.lastMessage.senderId
        }
      }
    })
    return res.status(200).json({
      message: "Message marked as read",
      seenBy: updated?.seenBy || [],
      myUnreadCount: updated?.unReadCounts[userId] || 0
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
// DELETE CONVERSATION
// ==========================================
export const deleteConversation = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.toString() === userId.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Conversation.findByIdAndDelete(conversationId);

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
export const getUserConversationForSocketIo = async (userId) => {
  try {
    const conversations = await Conversation.find(
      { "participants.userId": userId },
      { _id: 1 },
    );

    return conversations.map((c) => c._id.toString());
  } catch (error) {
    console.log("error when fetch conversation", error);
    return [];
  }
};
