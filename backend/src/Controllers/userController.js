import { forgotPasswordTemplate } from "../Templates/emailTemplates.js";
import asyncHandler from "express-async-handler";
import User from "../Models/User.js";
import {sendEmail} from "../Services/emailService.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { stat } from "fs";

// ============================
// FORGOT PASSWORD TOKEN
// ============================
export const authMe = asyncHandler(async (req, res) => {
  try{
    const user = req.user;
        return res.status(200).json({user: user});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal Server Error !!!"})
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

  res.status(200).json({ message: "Email sent successfully", success: true});
});

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

  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

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