import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getAllFriends,
  removeFriend,
  getSentFriendRequests,
  getFriendSuggestions,
} from "../Controllers/friendController.js";

import { protectedRoute } from "../Middlewares/authMiddleware.js";


const router = express.Router();

router.post("/request", protectedRoute, sendFriendRequest);
router.put("/accept/:requestId", protectedRoute, acceptFriendRequest);
router.put("/reject/:requestId", protectedRoute, rejectFriendRequest);
router.get("/requests", protectedRoute, getFriendRequests);
router.get("/sent-requests", protectedRoute, getSentFriendRequests);

router.get("/", protectedRoute, getAllFriends);
router.delete("/remove/:friendId", protectedRoute, removeFriend);
router.get("/suggestions", protectedRoute, getFriendSuggestions);

export default router;