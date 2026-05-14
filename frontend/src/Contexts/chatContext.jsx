import ChatBox from "@/components/chat/ChatBox";
import { useAuthStore } from "@/stores/authStore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ChatContext = createContext();

const MAX_CHAT_WINDOWS = 2;

export const ChatProvider = ({
  children,
}) => {
  const {user} = useAuthStore();

  const [openedChats, setOpenedChats] =
    useState([]);

  /*
   * OPEN CHAT
   */
  const openChat = (id) => {
    setOpenedChats((prev) => {
      // already opened -> move to end
      if (prev.includes(id)) {
        return [
          ...prev.filter((c) => c !== id),
          id,
        ];
      }

      // max 3 chats
      if (prev.length >= MAX_CHAT_WINDOWS) {
        return [...prev.slice(1), id];
      }

      return [...prev, id];
    });
  };

  /*
   * CLOSE CHAT
   */
  const closeChat = (id) => {
    setOpenedChats((prev) =>
      prev.filter((chatId) => chatId !== id),
    );
  };
useEffect(() => {
  if (!user) {
    setOpenedChats([]);
  }
}, [user]);
  return (
    <ChatContext.Provider
      value={{
        openedChats,
        openChat,
        closeChat,
      }}
    >
      {children}

      {/* CHAT WINDOWS */}
      <div className="fixed bottom-5 right-5 z-50 flex items-end gap-4">
        {openedChats.map((chatId) => (
          <div
            key={chatId}
            className="h-[450px] w-[340px]"
          >
            <ChatBox
              conversationId={chatId}
              onClose={() =>
                closeChat(chatId)
              }
            />
          </div>
        ))}
      </div>
    </ChatContext.Provider>
  );
};

export const useChat = () =>
  useContext(ChatContext);