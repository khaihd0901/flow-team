import ChatBox from "./ChatBox";

const ChatListBox = ({ chatId, closeChat }) => {
  return (
    <div className="w-sm h-[400px] flex items-center justify-center">
       <ChatBox key={chatId} onClose={() => closeChat(chatId)} />
    </div>
  );
};

export default ChatListBox;