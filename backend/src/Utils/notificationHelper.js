export const emitFriendRequest = (io,friendRequest,req,recipientId) =>{
    io.to(recipientId.toString()).emit("new-friend-request", {
  _id: friendRequest._id,
  requester: req.user,
  createdAt: friendRequest.createdAt,
});
}