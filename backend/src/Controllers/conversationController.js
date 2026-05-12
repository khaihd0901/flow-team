import asyncHandler from "express-async-handler";
import Conversation from "../Models/Conversation.js";
import Friend from "../Models/Friend.js";
import User from "../Models/User.js";

// ==========================================
// CREATE PRIVATE CONVERSATION
// ==========================================
export const createPrivateConversation = asyncHandler(
  async (req, res) => {
    try {
      const currentUserId = req.user._id;
      const { receiverId } = req.body;

      // prevent self chat
      if (currentUserId.toString() === receiverId) {
        return res.status(400).json({
          success: false,
          message: "You cannot create conversation with yourself",
        });
      }

      // check receiver exists
      const receiver = await User.findById(receiverId);

      if (!receiver) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // check friendship
      const friendship = await Friend.findOne({
        status: "accepted",
        $or: [
          {
            requester: currentUserId,
            recipient: receiverId,
          },
          {
            requester: receiverId,
            recipient: currentUserId,
          },
        ],
      });

      if (!friendship) {
        return res.status(403).json({
          success: false,
          message: "You can only chat with friends",
        });
      }

      // check existing conversation
      let conversation = await Conversation.findOne({
        type: "private",
        participants: {
          $all: [currentUserId, receiverId],
          $size: 2,
        },
      })
        .populate(
          "participants",
          "fullName avatarUrl isOnline"
        )
        .populate("lastMessage");

      // already exists
      if (conversation) {
        return res.status(200).json({
          success: true,
          message: "Conversation already exists",
          data: conversation,
        });
      }

      // create conversation
      conversation = await Conversation.create({
        type: "private",
        participants: [currentUserId, receiverId],
      });

      const populatedConversation =
        await Conversation.findById(conversation._id)
          .populate(
            "participants",
            "fullName avatarUrl isOnline"
          );

      return res.status(201).json({
        success: true,
        message: "Conversation created successfully",
        data: populatedConversation,
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
// CREATE GROUP CONVERSATION
// ==========================================
export const createGroupConversation = asyncHandler(
  async (req, res) => {
    try {
      const currentUserId = req.user._id;

      const {
        groupName,
        participants,
        groupAvatar,
        description,
      } = req.body;

      // validation
      if (!groupName?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Group name is required",
        });
      }

      if (
        !participants ||
        !Array.isArray(participants)
      ) {
        return res.status(400).json({
          success: false,
          message: "Participants must be an array",
        });
      }

      // include creator automatically
      const uniqueParticipants = [
        ...new Set([
          ...participants,
          currentUserId.toString(),
        ]),
      ];

      // minimum members
      if (uniqueParticipants.length < 3) {
        return res.status(400).json({
          success: false,
          message:
            "Group conversation must contain at least 3 members",
        });
      }

      // check users exist
      const users = await User.find({
        _id: { $in: uniqueParticipants },
      });

      if (users.length !== uniqueParticipants.length) {
        return res.status(400).json({
          success: false,
          message: "Some users do not exist",
        });
      }

      // create group
      const conversation = await Conversation.create({
        type: "group",
        groupName,
        groupAvatar: groupAvatar || "",
        description: description || "",
        participants: uniqueParticipants,
        admins: [currentUserId],
      });

      const populatedConversation =
        await Conversation.findById(conversation._id)
          .populate(
            "participants",
            "fullName avatarUrl isOnline"
          )
          .populate(
            "admins",
            "fullName avatarUrl"
          );

      return res.status(201).json({
        success: true,
        message: "Group created successfully",
        data: populatedConversation,
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
// GET USER CONVERSATIONS
// ==========================================
export const getUserConversations = asyncHandler(
  async (req, res) => {
    try {
      const userId = req.user._id;

      const conversations = await Conversation.find({
        participants: userId,
      })
        .populate(
          "participants",
          "fullName avatarUrl isOnline lastSeen"
        )
        .populate(
          "admins",
          "fullName avatarUrl"
        )
        .populate({
          path: "lastMessage",
          populate: {
            path: "sender",
            select: "fullName avatarUrl",
          },
        })
        .sort({ updatedAt: -1 });

      const formattedConversations =
        conversations.map((conversation) => {
          if (conversation.type === "private") {
            const otherUser =
              conversation.participants.find(
                (participant) =>
                  participant._id.toString() !==
                  userId.toString()
              );

            return {
              ...conversation.toObject(),
              chatName: otherUser?.fullName,
              chatAvatar: otherUser?.avatarUrl,
              otherUser,
            };
          }

          return {
            ...conversation.toObject(),
            chatName: conversation.groupName,
            chatAvatar: conversation.groupAvatar,
          };
        });

      return res.status(200).json({
        success: true,
        data: formattedConversations,
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
// GET SINGLE CONVERSATION
// ==========================================
export const getConversationById = asyncHandler(
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { conversationId } = req.params;

      const conversation =
        await Conversation.findById(conversationId)
          .populate(
            "participants",
            "fullName avatarUrl isOnline lastSeen"
          )
          .populate(
            "admins",
            "fullName avatarUrl"
          )
          .populate("lastMessage");

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      const isParticipant =
        conversation.participants.some(
          (participant) =>
            participant._id.toString() ===
            userId.toString()
        );

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message:
            "You are not a participant of this conversation",
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
  }
);

// ==========================================
// DELETE CONVERSATION
// ==========================================
export const deleteConversation = asyncHandler(
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { conversationId } = req.params;

      const conversation =
        await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      const isParticipant =
        conversation.participants.some(
          (participant) =>
            participant.toString() ===
            userId.toString()
        );

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      await Conversation.findByIdAndDelete(
        conversationId
      );

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
  }
);