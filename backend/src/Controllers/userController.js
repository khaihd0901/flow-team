import { forgotPasswordTemplate } from "../Templates/emailTemplates.js";
import asyncHandler from "express-async-handler";
import User from "../Models/User.js";
import { sendEmail } from "../Services/emailService.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { stat } from "fs";
import { uploadMedia } from "../Configs/cloudinaryConfig.js";
import Conversation from "../Models/Conversation.js";
import Friend from "../Models/Friend.js";

// ============================
// AUTH ME
// ============================
export const authMe = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !!!" });
  }
});
// ============================
// FORGOT PASSWORD TOKEN
// ============================
export const forgotPasswordOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found !!!");
  }

  const OTP = await user.createOTP();
  await user.save();
  await sendEmail({
    to: email,
    subject: "Forgot Password",
    html: forgotPasswordTemplate(OTP),
  });

  res.status(200).json({ message: "Email sent successfully", success: true });
});
// ============================
// VERIFY OTP
// ============================
export const verifyOTP = asyncHandler(async (req, res) => {
  const { otp, email } = req.body;
  console.log(otp, email);
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    passWordResetOTP: hashedOTP,
    passWordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }
  res.json({ message: "OTP verified successfully", success: true });
});
// ============================
// RESET PASSWORD
// ============================
export const resetPassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword, otp, email } = req.body;

  // password match
  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    passWordResetOTP: hashedOTP,
    passWordResetExpires: { $gt: Date.now() },
  }).select("+hashedPassword");

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }
  // const isSamePassword = await bcrypt.compare(
  //   password,
  //   user.hashedPassword
  // );

  // if (isSamePassword) {
  //   res.status(400);
  //   throw new Error(
  //     "New password cannot be the same as old password"
  //   );
  // }

  // save new password
  user.hashedPassword = password;

  // clear reset fields
  user.passWordResetOTP = undefined;
  user.passWordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});
// ============================
// USER UPDATE PROFILE
// ============================
export const userUpdateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, bio, avatarUrl } = req.body;
  const userId = req.user._id;
  try {
    const file = req.file;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found !!!");
    }
    if (file) {
      const uploadResult = await uploadMedia(file.path);
      console.log(uploadResult);
      user.avatarUrl = uploadResult.url;
    } else if (avatarUrl) {
      user.avatarUrl = avatarUrl;
    }

    if (bio) user.bio = bio;
    if (firstName || lastName) {
      user.name = `${firstName || user.firstName} ${lastName || user.lastName}`;
    }
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile updated successfully", success: true, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !!!" });
  }
});
// ============================
// GET ALL USERS
// ============================
export const getAllUsers = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;
  try {
    const users = await User.find({ _id: { $ne: loggedInUserId } })
      .select("username fullName isOnline lastSeen phone bio avatarUrl")
      .lean();

    const userWithConversation = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [loggedInUserId, user._id] },
        })
          .populate({
            path: "lastMessage",
            select: "content createdAt sender receiver",
          })
          .lean();

        return {
          ...user,
          conversation: conversation || null,
        };
      }),
    );
    return res.status(200).json({ users: userWithConversation, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error !!!" });
  }
});

export const searchUserByName = asyncHandler(async (req, res) => {
  try {
    const { fullName } = req.query;

    if (!fullName || !fullName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    const users = await User.find({
      $or: [
        {
          fullName: {
            $regex: fullName,
            $options: "i",
          },
        },
        {
          username: {
            $regex: fullName,
            $options: "i",
          },
        },
      ],
    })
      .select("_id fullName username avatarUrl")
      .limit(10);

    return res.status(200).json({ users });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!!",
    });
  }
});

export const userPowerSearch = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const { q } = req.query;

    if (!q?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const keyword = q.trim();

    // SAFE REGEX
    const regex = new RegExp(
      keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );

    const relationships = await Friend.find({
      $or: [{ requester: currentUserId }, { recipient: currentUserId }],
    }).select("requester recipient");

    // EXCLUDED IDS
    const excludedUserIds = new Set();

    // exclude self
    excludedUserIds.add(currentUserId.toString());

    // exclude friends / pending users
    relationships.forEach((rel) => {
      excludedUserIds.add(rel.requester.toString());

      excludedUserIds.add(rel.recipient.toString());
    });

    /*
    =========================================================
    SEARCH USERS
    =========================================================
    */

    const users = await User.find({
      _id: {
        $nin: [...excludedUserIds],
      },

      $or: [{ fullName: regex }, { username: regex }],
    })
      .select("fullName username avatarUrl")
      .limit(10);

    /*
    =========================================================
    SEARCH GROUP CHATS
    =========================================================
    */

    const groupChats = await Conversation.find({
      type: "group",

      "group.name": regex,

      // only groups current user joined
      "participants.userId": currentUserId,
    })
      .populate("participants.userId", "fullName avatarUrl")
      .limit(10);
    return res.status(200).json({
      success: true,

      result: {
        users,
        groupChats,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
