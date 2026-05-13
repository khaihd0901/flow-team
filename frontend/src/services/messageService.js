import api from "@/libs/api";

const sendMessage = async (data) => {
  const res = await api.post(
    "/message/send",
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

const getMessagesByConversation = async (conversationId,cursor) => {
  const res = await api.get(`/message/conversation/${conversationId}/messages?cursor=${cursor}`);

  return res.data;
};

const markMessageAsRead = async (messageId) => {
  const res = await api.put(`/message/read/${messageId}`);

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
  sendMessage,
  getMessagesByConversation,
  markMessageAsRead,
  reactToMessage,
  deleteMessage,
};

export default messageService;
