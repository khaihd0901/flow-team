import ChatBox from "@/components/chat/ChatBox";
import { createContext, useContext, useState } from "react";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const MAX_VISIBLE = 3;
  const MAX_OPEN = 5;
  const [openChatBox, setOpenChatBox] = useState([]);
  const [visibleChats, setVisibleChats] = useState([]);
  const openChat = (id) => {

    setOpenChatBox((prev) => {
      let newOpen = [...prev];

      if (!newOpen.includes(id)) {
        newOpen.push(id);
      }

      if (newOpen.length > MAX_OPEN) {
        const removed = newOpen.shift();

        setVisibleChats((prevVisible) =>
          prevVisible.filter((chat) => chat !== removed),
        );
      }

      return newOpen;
    });

    setVisibleChats((prev) => {
      if (prev.includes(id)) return prev;

      let newVisible = [...prev, id];

      if (newVisible.length > MAX_VISIBLE) {
        newVisible.shift();
      }

      return newVisible;
    });
  };

  const closeChat = (id) => {
    setOpenChatBox((prev) => prev.filter((chat) => chat !== id));

    setVisibleChats((prev) => {
      const newVisible = prev.filter((chat) => chat !== id);

      const hiddenChats = openChatBox.filter(
        (chat) => !newVisible.includes(chat) && chat !== id,
      );

      if (hiddenChats.length > 0 && newVisible.length < MAX_VISIBLE) {
        newVisible.unshift(hiddenChats[hiddenChats.length - 1]);
      }

      return newVisible;
    });
  };
  return (
    <ChatContext.Provider
      value={{
        openChat,
        closeChat,
      }}
    >
      {children}

<div className="fixed bottom-5 right-5 z-50 flex gap-3">
  {visibleChats.map((id) => (
    <div
      key={id}
      className="w-[340px] h-100 flex items-center justify-center"
    >
      <ChatBox
        onClose={() => closeChat(id)}
      />
    </div>
  ))}
</div>
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
