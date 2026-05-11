import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    avatarId: {
      type: String,
    },
    bio: {
      type: String,
      maxLength: 500,
    },
    phone: {
      type: String,
      sparse: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    providers: [
      {
        type: { type: String }, // "github", "google"
        providerId: String,
      },
    ],
    accountVerifyToken: String,
    accountVerifyExpires: Date,

    passWordChangedAt: Date,
    passWordResetExpires: Date,
    passWordResetOTP: String,
  },
  {
    timeseries: true,
  },
);

userSchema.methods.createOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

  this.passWordResetOTP = crypto.createHash("sha256").update(otp).digest("hex");
  this.passWordResetExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

  return otp;
};

userSchema.methods.createAccountVerifyToken = function () {
  const verifyToken = crypto.randomBytes(32).toString("hex");
  this.accountVerifyToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  this.accountVerifyExpires = Date.now() + 24 * 60 * 60 * 1000; // 1 day
};
userSchema.index({ accountVerifyExpires: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.model("User", userSchema);
export default User;
