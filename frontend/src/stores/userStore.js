import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import userService from "@/services/userService";
export const useUserStore = create()(
  persist((set, get) => ({
    loading: false,
    success: false,
    error: false,
    clearState: () => {
      set({
        loading: false,
        success: false,
        error: false,
      });
    },
    userForgotPassword: async (data) => {
      try {
        get().clearState();
        set({
          loading: true,
          success: false,
          error: false,
        });
        const res = await userService.userForgotPassword(data);
        set({
          loading: false,
          success: true,
          error: false,
        });
        toast.success(res.message);
        return res;
      } catch (err) {
        console.log(err);
        set({
          loading: false,
          success: false,
          error: true,
        });
        toast.error(err.response.data.message);
      } finally {
        set({
          loading: false,
        });
      }
    },
    userVerifyOTP: async (data) => {
      try {
        set({ isLoading: true, error: null });

        const res = await userService.userVerifyOTP(data);

        set({
          isLoading: false,
          success: res.message,
          step: 3,
        });
        return res;
      } catch (err) {
        set({
          isLoading: false,
          error: err.response?.data?.message || "Invalid OTP",
        });
      }
    },
    userResetPassword: async (data) => {
      try {
        set({ isLoading: true, error: null });

        const res = await userService.userResetPassword(data);

        set({
          isLoading: false,
          success: res.message,
          step: 1,
          email: "",
        });
        toast.success(res.message);
        return res;
      } catch (err) {
        set({
          isLoading: false,
          error: err.response?.data?.message || "Reset failed",
        });
        toast.error(err.response?.data?.message || "Reset failed");
      }
    },
  })),
);
