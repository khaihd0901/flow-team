import api from "@/libs/api";

const sendDirectMessage = async (formData) => {
  const res = await api.post("/message/direct", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.message;
};

const sendGroupMessage = async (formData) => {
  const res = await api.post("/message/group", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.message;
};


const getMessagesByConversation = async (conversationId, cursor) => {
  const res = await api.get(
    `/message/conversation/${conversationId}/messages?cursor=${cursor}`,
  );

  return { messages: res.data.messages, cursor: res.data.nextCursor };
};

const markMessageAsRead = async (messageId) => {
  const res = await api.put(`/conversation/read/${messageId}`);

  return res.data;
};

const reactToMessage = async (messageId, emoji) => {
  const res = await api.put(`/message/react/${messageId}`, {
    emoji,
  });
  return res.data;
};
const deleteMessage = async (messageId) => {
  const res = await api.delete(`/message/${messageId}`);

  return res.data;
};
const messageService = {
  sendDirectMessage,
  sendGroupMessage,
  getMessagesByConversation,
  markMessageAsRead,
  reactToMessage,
  deleteMessage,
};

export default messageService;
