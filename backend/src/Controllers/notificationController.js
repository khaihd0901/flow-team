
import Notification from "../Models/Notification.js";

/**
 * GET ALL NOTIFICATIONS
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      recipientId: userId,
    })
      .populate("senderId", "fullName username avatarUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log("Get notifications error", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET UNREAD COUNT
 */
export const getUnreadNotificationCount = async (
  req,
  res,
) => {
  try {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.log("Get unread count error", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * CREATE NOTIFICATION
 */
export const createNotification = async ({
  recipientId,
  senderId,
  type,
  title,
  content,
  entityId = null,
  conversationId = null,
}) => {
  try {
    const notification = await Notification.create({
      recipientId,
      senderId,
      type,
      title,
      content,
      entityId,
      conversationId,
    });

    return notification;
  } catch (error) {
    console.log("Create notification error", error);
    return null;
  }
};

/**
 * MARK AS READ
 */
export const markNotificationAsRead = async (
  req,
  res,
) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipientId: userId,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.log("Mark notification error", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * MARK ALL AS READ
 */
export const markAllNotificationsAsRead = async (
  req,
  res,
) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      {
        recipientId: userId,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.log("Mark all notifications error", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * DELETE NOTIFICATION
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipientId: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.log("Delete notification error", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
