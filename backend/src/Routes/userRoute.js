import express from "express";
import {
  authMe,
  forgotPasswordOTP,
  resetPassword,
  userUpdateProfile,
  verifyOTP,
  getAllUsers,
  userPowerSearch
} from "../Controllers/userController.js";
import { protectedRoute } from "../Middlewares/authMiddleware.js";
import { upload } from "../Middlewares/mediaMiddleware.js";

const router = express.Router();

router.get("/me", protectedRoute, authMe);
router.get("/get-all-users", protectedRoute, getAllUsers);
router.get("/search",protectedRoute,userPowerSearch)
router.post("/forgot-password", forgotPasswordOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.put(
  "/update-profile",
  protectedRoute,
  upload.single("avatar"),
  userUpdateProfile,
);

export default router;
