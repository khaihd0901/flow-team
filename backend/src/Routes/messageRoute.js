import express from "express";

import {
  sendGroupMessage,
  sendDirectMessage,
  getMessagesByConversation,
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
router.post("/direct", protectedRoute, upload.array("files", 10), sendDirectMessage);
router.post("/group", protectedRoute, upload.array("files", 10), sendGroupMessage);


router.get(
  "/conversation/:conversationId/messages",
  protectedRoute,
  getMessagesByConversation
);
router.put("/react/:messageId", protectedRoute, reactToMessage);
router.delete("/:messageId", protectedRoute, deleteMessage);

export default router;
