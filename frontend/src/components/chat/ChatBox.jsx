import { useChatStore } from "@/stores/chatStore";
import ChatWellCome from "./ChatWellCome";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxBody from "./ChatBoxBody";
import ChatBoxFooter from "./ChatBoxFooter";
import { useEffect } from "react";

const ChatBox = ({ onClose }) => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    chatMarkAsSeen,
    loading,
  } = useChatStore();
  const messages = allMessages[activeConversationId]?.items || [];
  const selectedConver =
    conversations.find((c) => c._id === activeConversationId) || null;

  useEffect(() => {
    if (!selectedConver) {
      return null;
    }

    const markSeen = async () => {
      try {
        await chatMarkAsSeen();
      } catch (error) {
        console.error("Error when markSeen", error);
      }
    };

    markSeen();
  }, [chatMarkAsSeen, selectedConver]);

  if (!selectedConver) {
    return <ChatWellCome onCloseChat={onClose} />;
  }
  if(loading){
    return <div>...Loading</div>
  }

  if (!messages?.length < 0) {
    return (
      <div className="flex h-full justify-center items-center text-muted-foreground">
        do not have any message in this conversation
      </div>
    );
  }
  return (
    <div className="flex h-full w-full max-w-lg flex-col rounded-xl border bg-background shadow-sm">
      {/* Header */}
      <ChatBoxHeader onCloseChat={onClose} chat={selectedConver} />

      {/* Messages */}
      <ChatBoxBody messages={messages} allMessages={allMessages} selectedConver={selectedConver} activeConversationId={activeConversationId} />

      {/* Input */}
      <ChatBoxFooter selectedConver={selectedConver} />
    </div>
  );
};

export default ChatBox;
