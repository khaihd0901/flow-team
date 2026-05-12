import api from "@/libs/api";

const sendMessage = async (data) => {
  const formData = new FormData();

  formData.append("conversationId", data.conversationId);

  if (data.content) {
    formData.append("content", data.content);
  }

  if (data.files?.length > 0) {
    data.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const res = await api.post("/messages/send", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

const getMessagesByConversation = async (conversationId) => {
  const res = await api.get(`/messages/conversation/${conversationId}`);

  return res.data;
};

const markMessageAsRead = async (messageId) => {
  const res = await api.put(`/messages/read/${messageId}`);

  return res.data;
};

const reactToMessage = async (messageId, emoji) => {
  const res = await api.put(`/messages/react/${messageId}`, {
    emoji,
  });
  return res.data;
};
const deleteMessage = async (messageId) => {
  const res = await api.delete(`/messages/${messageId}`);

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
