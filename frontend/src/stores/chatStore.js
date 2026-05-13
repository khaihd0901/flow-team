import messageService from "@/services/messageService";
import conversationService from "@/services/conversationService";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";

export const useChatStore = create()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,
      loading: false,
      success: false,
      error: false,

      setActiveConversationId: (id) => set({ activeConversationId: id }),
      clearState: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          loading: false,
          success: false,
          error: false,
        });
      },
      chatGetAllConversations: async () => {
        try {
          set({ loading: true });
          const {conversations} = await conversationService.getUserConversations();
          set({
            conversations,
            loading: false,
            success: true,
          });
        } catch (err) {
          console.log("error when calling get conversations api", err);
          set({ error: true, loading: false });
        } finally {
          set({ loading: false });
        }
      },
      chatGetAllMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const converId = conversationId ?? activeConversationId;
        if (!converId) return;

        const current = messages?.[converId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;

        if (nextCursor === null) return;

        set({ loading: true });
        try {
          const { messages: fetched, cursor } =
            await messageService.getMessagesByConversation(
              converId,
              nextCursor,
            );
          set({ loading: false });
          const processed = fetched.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id,
          }));

          set((s) => {
            const prev = s.messages[converId]?.items ?? [];
            const merged =
              prev.length > 0 ? [...processed, ...prev] : processed;

            return {
              messages: {
                ...s.messages,
                [converId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? null,
                },
              },
            };
          });
        } catch (err) {
          console.log("error when fetch messages", err);
          set({ error: true });
        } finally {
          set({ loading: false });
        }
      },
      chatSendMessage: async (data) => {
        try {
          set({ loading: true });

          const res = await messageService.sendMessage(data);

          const newMessage = res.data;
          set((state) => ({
            messages: {
              ...state.messages,

              [newMessage.conversation]: [
                ...(state.messages[newMessage.conversation] || []),

                newMessage,
              ],
            },

            conversations: state.conversations.map((conversation) => {
              if (conversation._id !== newMessage.conversation) {
                return conversation;
              }

              return {
                ...conversation,

                lastMessage: {
                  _id: newMessage._id,
                  content: newMessage.content,
                  senderId: newMessage.sender?._id,
                  createdAt: newMessage.createdAt,
                },

                updatedAt: newMessage.createdAt,
              };
            }),
          }));

          return res;
        } catch (err) {
          console.log(err);
          throw err;
        } finally {
          set({ loading: false });
        }
      },
      chatAddMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { chatGetAllMessages } = get();

          message.isOwn = message.senderId === user?._id;
          const converId = message.conversationId;

          let prevItems = get().messages[converId]?.items || [];
          if (prevItems.length === 0) {
            await chatGetAllMessages(message.conversationId);
            prevItems = get().messages[converId]?.items || [];
          }
          set((s) => {
            if (prevItems.some((m) => m._id === message._id)) {
              return s;
            }
            return {
              messages: {
                ...s.messages,
                [converId]: {
                  items: [...prevItems, message],
                  hasMore: s.messages[converId].hasMore,
                  nextCursor: s.messages[converId].nextCursor || undefined,
                },
              },
            };
          });
        } catch (error) {
          console.log(error);
        }
      },
      chatUpdateConversation: async (conversation) => {
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c._id === conversation._id ? { ...c, ...conversation } : c,
          ),
        }));
      },
      chatMarkAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();
          if (!activeConversationId || !user) return;

          const conver = conversations.find(
            (c) => c._id === activeConversationId,
          );
          if (!conver) return;

          if ((conver.unReadCounts?.[user._id] ?? 0) === 0) return;

          await messageService.markMessageAsRead(activeConversationId);
          set((s) => ({
            conversations: s.conversations.map((c) =>
              c._id === activeConversationId && c.lastMessage
                ? {
                    ...c,
                    unReadCounts: {
                      ...c.unReadCounts,
                      [user._id]: 0,
                    },
                  }
                : c,
            ),
          }));
        } catch (error) {
          console.log("error when calling mark as seen", error);
        }
      },
      chatReactToMessage: async (messageId, emoji) => {
        try {
          const res = await messageService.reactToMessage(messageId, emoji);

          const updatedMessage = res.data.data;

          set((state) => ({
            messages: state.messages.map((message) =>
              message._id === messageId ? updatedMessage : message,
            ),
          }));

          return updatedMessage;
        } catch (err) {
          console.log("error when reacting to message", err);

          throw err;
        }
      },
      chatDeleteMessage: async (messageId) => {
        try {
          await messageService.deleteMessage(messageId);

          set((state) => {
            const filteredMessages = state.messages.filter(
              (message) => message._id !== messageId,
            );

            // latest remaining message
            const lastMessage =
              filteredMessages[filteredMessages.length - 1] || null;

            return {
              messages: filteredMessages,

              conversations: state.conversations.map((conversation) => {
                if (conversation._id !== get().activeConversationId) {
                  return conversation;
                }

                return {
                  ...conversation,

                  lastMessage: lastMessage
                    ? {
                        messageId: lastMessage._id,
                        content: lastMessage.content,
                        senderId: lastMessage.sender?._id,
                        createdAt: lastMessage.createdAt,
                      }
                    : null,
                };
              }),
            };
          });
        } catch (err) {
          console.log("error when deleting message", err);

          throw err;
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (s) => ({ conversations: s.conversations }),
    },
  ),
);
