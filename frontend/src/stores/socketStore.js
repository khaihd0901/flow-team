import { create } from "zustand";
import { io } from "socket.io-client";

import { useAuthStore } from "./authStore";
import { useChatStore } from "./chatStore";
import { useNotificationStore } from "./notificationStore";

const baseUrl = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  // ==========================================
  // CONNECT SOCKET
  // ==========================================
  connectSocket: () => {
    const existingSocket = get().socket;

    // prevent duplicate connections
    if (existingSocket?.connected) return;

    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) return;

    const socket = io(baseUrl, {
      auth: {
        token: accessToken,
      },

      transports: ["websocket", "polling"],

      withCredentials: true,
      autoConnect: true,
    });

    // ==========================================
    // CONNECT
    // ==========================================
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    // ==========================================
    // CONNECT ERROR
    // ==========================================
    socket.on("connect_error", (err) => {
      console.log("❌ Socket connect error:", err.message);
    });

    // ==========================================
    // ONLINE USERS
    // ==========================================
    socket.on("online-users", (userIds) => {
      set({
        onlineUsers: userIds,
      });
    });

    // ==========================================
    // NEW MESSAGE
    // ==========================================
    socket.on("new-message", ({ message, conversation, unReadCounts }) => {
      const activeConversationId = useChatStore.getState().activeConversationId;

      // add realtime message
      useChatStore.getState().chatAddMessage(message);

      const lastMessage = {
        _id: conversation.lastMessage._id,

        content: conversation.lastMessage.content,

        createdAt: conversation.lastMessage.createdAt,

        sender: {
          _id: conversation.lastMessage.senderId,

          fullName: "",
          avatarUrl: null,
        },
      };

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unReadCounts,
      };

      // if current conversation opened
      if (activeConversationId === message.conversationId) {
        useChatStore.getState().chatMarkAsSeen();
      }

      // update sidebar conversation
      useChatStore.getState().chatUpdateConversation(updatedConversation);
    });

    // ==========================================
    // READ MESSAGE
    // ==========================================
    socket.on("read-message", ({ conversation, lastMessage }) => {
      const updatedConversation = {
        _id: conversation._id,

        lastMessage,

        lastMessageAt: conversation.lastMessageAt,

        unReadCounts: conversation.unReadCounts,

        seenBy: conversation.seenBy,
      };

      useChatStore.getState().chatUpdateConversation(updatedConversation);
    });

    // ==========================================
    // NEW REQUEST NOTIFICATION
    // ==========================================
    socket.on("friend-request:new", (notification) => {
      console.log(notification)
      useNotificationStore.getState().addNotification(notification);
    });

    // ==========================================
    // NOTIFICATION REMOVED
    // ==========================================
    socket.on("notification:remove", ({ notificationId }) => {
      useNotificationStore.getState().removeNotification(notificationId);
    });

    // ==========================================
    // FRIEND REQUEST CANCELLED
    // ==========================================
    socket.on("friend-request:cancelled", ({ notificationId }) => {
      useNotificationStore.getState().removeNotification(notificationId);
    });

    // ==========================================
    // SAVE SOCKET
    // ==========================================
    set({
      socket,
    });
  },

  // ==========================================
  // DISCONNECT SOCKET
  // ==========================================
  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.removeAllListeners();

      socket.disconnect();

      console.log("🔌 Socket disconnected");

      set({
        socket: null,
        onlineUsers: [],
      });
    }
  },
}));
