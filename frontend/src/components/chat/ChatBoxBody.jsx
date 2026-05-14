import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import ChatMessageItem from "./ChatMessageItem";

import { useChatStore } from "@/stores/chatStore";
import ChatMessageSkeleton from "./ChatMessageSkeleton";

const ChatBoxBody = ({ allMessages, selectedConver, activeConversationId }) => {
  const chatGetAllMessages = useChatStore((state) => state.chatGetAllMessages);

  const [lastMessageStatus, setLastMessageStatus] = useState("sent");

  const containerRef = useRef(null);

  const shouldRestoreScrollRef = useRef(false);

  const previousScrollHeightRef = useRef(0);

  const key = `chat-scroll-${activeConversationId}`;

  const messages = allMessages?.[activeConversationId]?.items || [];

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const hasMore = allMessages?.[activeConversationId]?.hasMore || false;

  /*
   * INITIALIZE STORAGE
   */
  useEffect(() => {
    if (!activeConversationId) return;

    const existing = sessionStorage.getItem(key);

    if (!existing) {
      sessionStorage.setItem(
        key,
        JSON.stringify({
          scrollTop: 0,
        }),
      );
    }
  }, [key, activeConversationId]);

  /*
   * LAST MESSAGE STATUS
   */
  useEffect(() => {
    const lastMessage = selectedConver?.lastMessage;

    if (!lastMessage) return;

    const seenBy = selectedConver?.seenBy ?? [];

    setLastMessageStatus(seenBy.length > 0 ? "seen" : "sent");
  }, [selectedConver]);

  /*
   * RESTORE SCROLL WHEN REOPEN CHAT
   */
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const item = sessionStorage.getItem(key);

    if (!item) return;

    const { scrollTop } = JSON.parse(item);

    requestAnimationFrame(() => {
      container.scrollTop = scrollTop;
    });
  }, [activeConversationId]);

  /*
   * PRESERVE POSITION AFTER LOADING OLDER MESSAGES
   */
  useLayoutEffect(() => {
    if (!shouldRestoreScrollRef.current) return;

    const container = containerRef.current;

    if (!container) return;

    const newScrollHeight = container.scrollHeight;

    const previousScrollHeight = previousScrollHeightRef.current;

    const heightDiff = newScrollHeight - previousScrollHeight;

    container.scrollTop += heightDiff;

    shouldRestoreScrollRef.current = false;
  }, [messages.length]);

  /*
   * SAVE SCROLL POSITION
   */
  const handleScrollSave = () => {
    const container = containerRef.current;

    if (!container) return;

    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: container.scrollTop,
      }),
    );
  };

  /*
   * LOAD MORE MESSAGES
   */
  const getMoreMessages = async () => {
    if (!activeConversationId) return;

    const container = containerRef.current;

    if (!container) return;

    try {
      previousScrollHeightRef.current = container.scrollHeight;

      shouldRestoreScrollRef.current = true;

      await chatGetAllMessages(activeConversationId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-primary-foreground flex h-full flex-col overflow-hidden">
      <div
        id="scrollableDiv"
        ref={containerRef}
        onScroll={handleScrollSave}
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden px-3 py-3"
        style={{ height: "400px" }}
      >
        <InfiniteScroll
          dataLength={reversedMessages.length}
          next={getMoreMessages}
          hasMore={hasMore}
          inverse={true}
          scrollableTarget="scrollableDiv"
          loader={
            <div className="space-y-2 py-2">
              <ChatMessageSkeleton />
              <ChatMessageSkeleton />
              <ChatMessageSkeleton isOwn />
            </div>
          }
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "visible",
          }}
        >
          {reversedMessages.map((msg, index) => (
            <ChatMessageItem
              key={msg._id || index}
              message={msg}
              index={index}
              messages={reversedMessages}
              selectedConver={selectedConver}
              lastMessageStatus={lastMessageStatus}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatBoxBody;
