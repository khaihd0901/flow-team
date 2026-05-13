import api from "@/libs/api";

const createPrivateConversation = async (data) => {
  const res = await api.post("/conversation/private", data);

  return res.data;
};

const createGroupConversation = async (data) => {
  const res = await api.post("/conversation/group", data);
  return res.data;
};

const getUserConversations = async () => {
  const res = await api.get("/conversation");
  return res.data
};

const getConversationById = async (conversationId) => {
  const res = await api.get(`/conversations/${conversationId}`);

  return res.data;
};

const conversationService = {
  createPrivateConversation,
  createGroupConversation,
  getUserConversations,
  getConversationById,
};

export default conversationService;
