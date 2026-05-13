import express from "express";

import {
  createConversation,
  getUserConversations,
  getConversationById,
  deleteConversation,
} from "../Controllers/conversationController.js";

import { protectedRoute } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protectedRoute, createConversation);
router.get("/", protectedRoute, getUserConversations);
router.get("/:conversationId", protectedRoute, getConversationById);
router.delete("/:conversationId", protectedRoute, deleteConversation);

export default router;
