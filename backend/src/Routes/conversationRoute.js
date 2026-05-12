import express from "express";

import {
  createPrivateConversation,
  createGroupConversation,
  getUserConversations,
  getConversationById,
  deleteConversation,
} from "../Controllers/conversationController.js";

import { protectedRoute } from "../Middlewares/authMiddleware.js";


const router = express.Router();

// ==========================================
// PRIVATE CONVERSATION
// ==========================================
router.post(
  "/private",
  protectedRoute,
  createPrivateConversation
);

// ==========================================
// GROUP CONVERSATION
// ==========================================
router.post(
  "/group",
  protectedRoute,
  createGroupConversation
);

// ==========================================
// GET ALL USER CONVERSATIONS
// ==========================================
router.get(
  "/",
  protectedRoute,
  getUserConversations
);

// ==========================================
// GET SINGLE CONVERSATION
// ==========================================
router.get(
  "/:conversationId",
  protectedRoute,
  getConversationById
);

// ==========================================
// DELETE CONVERSATION
// ==========================================
router.delete(
  "/:conversationId",
  protectedRoute,
  deleteConversation
);

export default router;