import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ChatMessageItem from "./ChatMessageItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { useChatStore } from "@/stores/chatStore";

const ChatBoxBody = ({ allMessages, selectedConver, activeConversationId }) => {
  const key = `chat-scroll-${activeConversationId}`;
  const [lastMessageStatus, setLastMessageStatus] = useState("sent");
  //ref
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const messages = allMessages[activeConversationId]?.items || [];
  const reservedMessages = [...messages].reverse();
  const hasMore = allMessages[activeConversationId]?.hasMore || false;
  const { chatGetAllMessages } = useChatStore();

  sessionStorage.setItem(
    key,
    JSON.stringify({
      scrollTop: 0,
      scrollHeight: 0,
    }),
  );
  useEffect(() => {
    const lastMessage = selectedConver?.lastMessage;
    if (!lastMessage) {
      return;
    }
    const seenBy = selectedConver?.seenBy ?? [];

    setLastMessageStatus(seenBy.length > 0 ? "seen" : "sent");
  }, [selectedConver]);
  useLayoutEffect(() => {
    if (!messagesEndRef.current) {
      return;
    }
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [activeConversationId]);
  const getMoreMessages = async () => {
    if (!activeConversationId) {
      return;
    } 
    try {
      await chatGetAllMessages(activeConversationId);
    } catch (error) {
      console.log(error);
    }
  };
  const handleScrollSave = () => {
    const container = containerRef.current;
    if (!container || !activeConversationId) return;
    const key = `chat-scroll-${activeConversationId}`
    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
      }),
    );
  };
  
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const item = sessionStorage.getItem(key);
    if (item) {
      const { scrollTop } = JSON.parse(item);
      requestAnimationFrame(() => {
        container.scrollTop = scrollTop;
      });
    }
  }, [messages.length]);
  return (
    <div className="bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden px-3 py-3"
        style={{ height: "400px" }}
      >
        

        <div ref={messagesEndRef} />
        <InfiniteScroll
          dataLength={reservedMessages.length}
          next={getMoreMessages}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          loader={<p className="text-center">Loading...</p>}
          inverse={true}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "visible",
          }}
        >
          {reservedMessages?.map((msg, index) => (
            <ChatMessageItem
              key={msg._id || index}
              message={msg}
              index={index}
              messages={reservedMessages}
              selectedConver={selectedConver}
              lastMessageStatus={lastMessageStatus}
            />
          ))}
        </InfiniteScroll>
        <div />
      </div>
    </div>
  );
};

export default ChatBoxBody;
