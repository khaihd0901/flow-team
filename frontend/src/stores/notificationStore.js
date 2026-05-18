import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  // =========================
  // SET NOTIFICATIONS
  // =========================
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  // =========================
  // ADD NOTIFICATION
  // =========================
  addNotification: (notification) =>
    set((state) => {
      const exists = state.notifications.some(
        (n) => n._id === notification._id,
      );

      if (exists) return state;

      return {
        notifications: [notification, ...state.notifications],

        unreadCount: state.unreadCount + 1,
      };
    }),

  // =========================
  // MARK AS READ
  // =========================
  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n,
      ),

      unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0,
    })),

  // =========================
  // MARK ALL AS READ
  // =========================
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        isRead: true,
      })),

      unreadCount: 0,
    })),

  // =========================
  // REMOVE NOTIFICATION
  // =========================
  removeNotification: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (n) => n._id !== notificationId,
      ),
    })),
}));
