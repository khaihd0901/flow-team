import express from "express";

import {
  sendMessage,
  getMessagesByConversation,
  markMessageAsRead,
  deleteMessage,
  reactToMessage,
} from "../Controllers/messageController.js";

import { protectedRoute } from "../Middlewares/authMiddleware.js";

import { upload } from "../Middlewares/mediaMiddleware.js";


const router = express.Router();

// ==========================================
// SEND MESSAGE
// supports:
// - text
// - image
// - video
// - file
// ==========================================
router.post(
  "/send",
  protectedRoute,
  upload.array("files", 10),
  sendMessage
);

// ==========================================
// GET ALL MESSAGES OF CONVERSATION
// ==========================================
router.get(
  "/conversation/:conversationId",
  protectedRoute,
  getMessagesByConversation
);

// ==========================================
// MARK MESSAGE AS READ
// ==========================================
router.put(
  "/read/:messageId",
  protectedRoute,
  markMessageAsRead
);

// ==========================================
// REACT TO MESSAGE
// ==========================================
router.put(
  "/react/:messageId",
  protectedRoute,
  reactToMessage
);

// ==========================================
// DELETE MESSAGE
// ==========================================
router.delete(
  "/:messageId",
  protectedRoute,
  deleteMessage
);

export default router;