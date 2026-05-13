import express from "express";

import {
  createConversation,
  getUserConversations,
  deleteConversation,
  markConverSationAsSeen,
} from "../Controllers/conversationController.js";

import { protectedRoute } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protectedRoute, createConversation);
router.get("/", protectedRoute, getUserConversations);
router.put("/read/:conversationId", protectedRoute, markConverSationAsSeen);
router.delete("/:conversationId", protectedRoute, deleteConversation);

export default router;
