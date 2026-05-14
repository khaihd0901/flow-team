import api from "@/libs/api";

// ==========================================
// SEND FRIEND REQUEST
// ==========================================
const sendFriendRequest = async (data) => {
  console.log(data)
  const res = await api.post("/friend/request", data);
  return res.data;
};

// ==========================================
// ACCEPT FRIEND REQUEST
// ==========================================
const acceptFriendRequest = async (requestId) => {
  const res = await api.put(`/friend/accept/${requestId}`);

  return res.data;
};

// ==========================================
// REJECT FRIEND REQUEST
// ==========================================
const rejectFriendRequest = async (requestId) => {
  const res = await api.put(`/friend/reject/${requestId}`);

  return res.data;
};

// ==========================================
// GET FRIEND REQUESTS
// ==========================================
const getFriendRequests = async () => {
  const res = await api.get("/friend/requests");

  return res.data;
};

// ==========================================
// GET ALL FRIENDS
// ==========================================
const getAllFriends = async () => {
  const res = await api.get("/friend/all");

  return res.data;
};

// ==========================================
// REMOVE FRIEND
// ==========================================
const removeFriend = async (friendId) => {
  const res = await api.delete(`/friend/remove/${friendId}`);

  return res.data;
};

// ==========================================
// GET FRIEND SUGGESTIONS
// ==========================================
const getFriendSuggestions = async () => {
  const res = await api.get("/friend/suggestions");

  return res.data;
};

const friendService = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getAllFriends,
  removeFriend,
  getFriendSuggestions,
};

export default friendService;
