import { useChatStore } from "@/stores/chatStore";
import ChatWellCome from "./ChatWellCome";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxBody from "./ChatBoxBody";
import ChatBoxFooter from "./ChatBoxFooter";
import { useEffect, useMemo } from "react";

const ChatBox = ({
  onClose,
  conversationId,
}) => {
  const conversations = useChatStore(
    (s) => s.conversations,
  );

  const allMessages = useChatStore(
    (s) => s.messages,
  );

  const chatMarkAsSeen = useChatStore(
    (s) => s.chatMarkAsSeen,
  );

  /*
   * CURRENT CONVERSATION
   */
  const selectedConver = useMemo(() => {
    return (
      conversations.find(
        (c) => c._id === conversationId,
      ) || null
    );
  }, [conversations, conversationId]);

  /*
   * MESSAGES
   */
  const messages =
    allMessages?.[conversationId]?.items || [];

  /*
   * MARK AS SEEN
   */
  useEffect(() => {
    if (!selectedConver) return;

    const markSeen = async () => {
      try {
        await chatMarkAsSeen(conversationId);
      } catch (error) {
        console.error(
          "Error when markSeen",
          error,
        );
      }
    };

    markSeen();
  }, [
    chatMarkAsSeen,
    selectedConver,
    conversationId,
  ]);

  /*
   * EMPTY
   */
  if (!selectedConver) {
    return (
      <ChatWellCome
        onCloseChat={onClose}
      />
    );
  }

  /*
   * CHAT UI
   */
  return (
    <div className="flex h-full w-full max-w-lg flex-col rounded-xl border bg-background shadow-sm">
      {/* Header */}
      <ChatBoxHeader
        onCloseChat={onClose}
        chat={selectedConver}
      />

      {/* Messages */}
      <ChatBoxBody
        messages={messages}
        allMessages={allMessages}
        selectedConver={selectedConver}
        activeConversationId={
          conversationId
        }
      />

      {/* Input */}
      <ChatBoxFooter
        selectedConver={selectedConver}
      />
    </div>
  );
};

export default ChatBox;