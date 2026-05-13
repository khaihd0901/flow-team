import asyncHandler from "express-async-handler";
import Conversation from "../Models/Conversation.js";
import Friend from "../Models/Friend.js";
import User from "../Models/User.js";

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
        participants: [{ userId: currentUserId }, ...memberIds.map((id) => ({ userId: id }))],
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
        select: "fullName avatarUrl"
      })
      .populate({
        path: "lastMessage.senderId",
        select: "fullName avatarUrl",
      })
      .populate({
        path: "seenBy",
        select: "fullName avatarUrl",
      })

    const formatted = conversations.map((conversation) => {
      const participants = (conversation.participants || []).map((p) => ({
        _id: p.userId?._id,
        fullName: p.userId?.fullName,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt
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
// GET SINGLE CONVERSATION
// ==========================================
export const getConversationById = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId)
      .populate("participants", "fullName avatarUrl isOnline lastSeen")
      .populate("admins", "fullName avatarUrl");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant._id.toString() === userId.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant of this conversation",
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
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
