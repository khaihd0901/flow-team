import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (notification) => {
    set((state) => ({
      notifications: [
        notification,
        ...state.notifications,
      ],
    }));
  },
  removeNotification: (requestId) =>
  set((state) => ({
    notifications: state.notifications.filter(
      (notification) =>
        notification._id !== requestId
    ),
  })),
}));