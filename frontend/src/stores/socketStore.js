import { create } from "zustand";
import { io } from "socket.io-client";
import { useAuthStore } from "./authStore";
import { useChatStore } from "./chatStore";

const baseUrl = import.meta.env.VITE_SOCKET_URL;
export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: () => {
    const { socket } = get();
    if (socket?.connected) return;

    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) return;

    const newSocket = io(baseUrl, {
      auth: {
        token: accessToken,
      },
      transports: ["polling", "websocket"],
      autoConnect: true,
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });
    newSocket.on("new-message", ({ message, conversation, unReadCounts }) => {
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

      const updatedConver = {
        ...conversation,
        lastMessage,
        unReadCounts,
      };

      if (
        useChatStore.getState().activeConversationId === message.conversationId
      ) {
        useChatStore.getState().chatMarkAsSeen();
      }

      useChatStore.getState().chatUpdateConversation(updatedConver);
    });

    newSocket.on("read-message", ({ conversation, lastMessage }) => {
      const updated = {
        _id: conversation._id,
        lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unReadCounts: conversation.unReadCounts,
        seenBy: conversation.seenBy
      };
      newSocket.on("connect_error", (err) => {
        console.log("Socket connect error:", err.message);
      });
      useChatStore.getState().chatUpdateConversation(updated);
    });
    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
