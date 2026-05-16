import { create } from "zustand";

import { toast } from "sonner";

import friendService from "@/services/friendService";

export const useFriendStore = create((set, get) => ({
  friends: [],

  requests: [],
sentRequests: [],
  suggestions: [],

  loading: false,

  error: null,

  // =====================================
  // SEND FRIEND REQUEST
  // =====================================
  sendFriendRequest: async (data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await friendService.sendFriendRequest(data);

      set({
        loading: false,
      });

      toast.success(res.message);

      return res;
    } catch (err) {
      console.log(err);

      set({
        loading: false,
        error: err.response?.data?.message,
      });

      toast.error(err.response?.data?.message);
    }
  },

  // =====================================
  // GET FRIEND REQUESTS
  // =====================================
  getFriendRequests: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await friendService.getFriendRequests();

      set({
        requests: res.data,
        loading: false,
      });
    } catch (err) {
      console.log(err);

      set({
        loading: false,
        error: err.response?.data?.message,
      });
    }
  },
  // =====================================
  // GET FRIEND REQUESTS
  // =====================================
  getSentFriendRequests: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await friendService.getSentFriendRequests();

      set({
        sentRequests: res.requests,
        loading: false,
      });
    } catch (err) {
      console.log(err);

      set({
        loading: false,
        error: err.response?.data?.message,
      });
    }
  },
  // =====================================
  // ACCEPT FRIEND REQUEST
  // =====================================
  acceptFriendRequest: async (requestId) => {
    try {
      const res = await friendService.acceptFriendRequest(requestId);

      // remove request
      set((state) => ({
        requests: state.requests.filter((request) => request._id !== requestId),
      }));

      // refresh friends
      get().getAllFriends();

      toast.success(res.message);
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message);
    }
  },

  // =====================================
  // REJECT FRIEND REQUEST
  // =====================================
  rejectFriendRequest: async (requestId) => {
    try {
      const res = await friendService.rejectFriendRequest(requestId);

      set((state) => ({
        requests: state.requests.filter((request) => request._id !== requestId),
      }));

      toast.success(res.message);
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message);
    }
  },

  // =====================================
  // GET ALL FRIENDS
  // =====================================
  getAllFriends: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await friendService.getAllFriends();

      set({
        friends: res.data,
        loading: false,
      });
    } catch (err) {
      console.log(err);

      set({
        loading: false,
        error: err.response?.data?.message,
      });
    }
  },

  // =====================================
  // REMOVE FRIEND
  // =====================================
  removeFriend: async (friendId) => {
    try {
      const res = await friendService.removeFriend(friendId);

      set((state) => ({
        friends: state.friends.filter((friend) => friend.user._id !== friendId),
      }));

      toast.success(res.message);
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message);
    }
  },

  // =====================================
  // GET FRIEND SUGGESTIONS
  // =====================================
  getFriendSuggestions: async () => {
    try {
      const res = await friendService.getFriendSuggestions();

      set({
        suggestions: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  },
}));
