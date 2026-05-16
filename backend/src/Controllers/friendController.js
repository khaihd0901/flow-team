
import asyncHandler from "express-async-handler";
import Friend from "../Models/Friend.js";
import User from "../Models/User.js";
import Conversation from "../Models/Conversation.js";

// ==========================================
// SEND FRIEND REQUEST
// ==========================================
export const sendFriendRequest = asyncHandler(async (req, res) => {
  try {
    const requesterId = req.user._id;
    const  {recipientId}  = req.body;

    if (requesterId.toString() === recipientId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send friend request to yourself",
      });
    }

    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingFriendship = await Friend.findOne({
      $or: [
        {
          requester: requesterId,
          recipient: recipientId,
        },
        {
          requester: recipientId,
          recipient: requesterId,
        },
      ],
    });

    if (existingFriendship) {
      return res.status(400).json({
        success: false,
        message: "Friend request already exists",
      });
    }

    const friendRequest = await Friend.create({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Friend request sent successfully",
      data: friendRequest,
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
// ACCEPT FRIEND REQUEST
// ==========================================
export const acceptFriendRequest = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const friendRequest = await Friend.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (friendRequest.recipient.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    friendRequest.status = "accepted";

    await friendRequest.save();

    return res.status(200).json({
      success: true,
      message: "Friend request accepted",
      data: friendRequest,
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
// REJECT FRIEND REQUEST
// ==========================================
export const rejectFriendRequest = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const friendRequest = await Friend.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (friendRequest.recipient.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    friendRequest.status = "rejected";

    await friendRequest.save();

    return res.status(200).json({
      success: true,
      message: "Friend request rejected",
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
// GET FRIEND REQUESTS
// ==========================================
export const getFriendRequests = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Friend.find({
      recipient: userId,
      status: "pending",
    })
      .populate("requester", "fullName avatarUrl email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
export const getSentFriendRequests = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
console.log(userId)
    const requests = await Friend.find({
      requester: userId,
      status: "pending",
    })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      requests
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
// GET ALL FRIENDS
// ==========================================
export const getAllFriends = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const friends = await Friend.find({
      status: "accepted",
      $or: [
        { requester: userId },
        { recipient: userId },
      ],
    })
      .populate("requester", "fullName avatarUrl isOnline lastSeen")
      .populate("recipient", "fullName avatarUrl isOnline lastSeen")
      .sort({ updatedAt: -1 });

    const formattedFriends = friends.map((friend) => {
      const otherUser =
        friend.requester._id.toString() === userId.toString()
          ? friend.recipient
          : friend.requester;

      return {
        friendshipId: friend._id,
        user: otherUser,
        createdAt: friend.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedFriends,
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
// REMOVE FRIEND
// ==========================================
export const removeFriend = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    const friendship = await Friend.findOne({
      status: "accepted",
      $or: [
        {
          requester: userId,
          recipient: friendId,
        },
        {
          requester: friendId,
          recipient: userId,
        },
      ],
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: "Friendship not found",
      });
    }

    await Friend.findByIdAndDelete(friendship._id);

    return res.status(200).json({
      success: true,
      message: "Friend removed successfully",
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
// GET FRIEND SUGGESTIONS
// ==========================================
export const getFriendSuggestions = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friend.find({
      $or: [
        { requester: userId },
        { recipient: userId },
      ],
    });

    const excludedUserIds = friendships.flatMap((friend) => [
      friend.requester.toString(),
      friend.recipient.toString(),
    ]);

    excludedUserIds.push(userId.toString());

    const suggestions = await User.find({
      _id: {
        $nin: excludedUserIds,
      },
    })
      .select("fullName avatarUrl")
      .limit(10);

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});