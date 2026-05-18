
import express from "express";

import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../Controllers/notificationController.js";
import { protectedRoute } from "../Middlewares/authMiddleware.js";


const router = express.Router();

router.get("/", protectedRoute, getNotifications);

router.get(
  "/unread-count",
  protectedRoute,
  getUnreadNotificationCount,
);

router.patch(
  "/:notificationId/read",
  protectedRoute,
  markNotificationAsRead,
);

router.patch(
  "/read-all",
  protectedRoute,
  markAllNotificationsAsRead,
);

router.delete(
  "/:notificationId",
  protectedRoute,
  deleteNotification,
);

export default router;
