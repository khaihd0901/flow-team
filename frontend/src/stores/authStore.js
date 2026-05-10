import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import authService from "../services/authService";
export const useAuthStore = create()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,
      success: false,
      error: false,

      setAccessToken: (token) => set({ accessToken: token }),
      clearState: () => {
        set({
          accessToken: null,
          user: null,
          loading: false,
          success: false,
          error: false,
        });
        localStorage.clear();
        sessionStorage.clear();
      },
      authRegister: async (data) => {
        try {
          get().clearState();
          set({
            loading: true,
            success: false,
            error: false,
          });
          await authService.authRegister(data);
          set({
            loading: false,
            success: true,
            error: false,
          });
          
          toast.success("Register Successful !!!");
        } catch (err) {
          set({
            loading: false,
            success: false,
            error: true,
          });
          console.log(err.response);
          toast.error(err.response.data.message);
        } finally {
          set({
            loading: false,
          });
        }
      },
      authLogin: async (data) => {
        try {
          get().clearState();
          set({
            loading: true,
            success: false,
            error: false,
          });

          const user = await authService.authLogin(data);
          if (user) {
            set({ success: true });
            get().setAccessToken(user.accessToken);
            await get().authMe();
          }
          toast.success("Login Successful !!!");
        } catch (err) {
          set({
            loading: false,
            success: false,
            error: true,
          });
          console.log(err.response);
          toast.error(err.response.data.message);
        } finally {
          set({
            loading: false,
          });
        }
      },
      authMe: async () => {
        try {
          set({ loading: true });
          const user = await authService.authMe();
          set({ success: true, user: user });
        } catch (err) {
          set({
            user: null,
            accessToken: null,
            loading: false,
            success: false,
            error: true,
          });
          console.log(err);
          toast.error("Get Profile Failed !!!");
        } finally {
          set({
            loading: false,
          });
        }
      },
      authRefreshToken: async () => {
        try {
          sessionStorage.clear();
          set({ loading: true });
          const { user, authMe, setAccessToken } = get();
          const accessToken = await authService.authRefreshToken();
          set({ success: true });
          setAccessToken(accessToken);
          if (!user) {
            await authMe();
          }
        } catch (err) {
          console.log(err);
          toast.error("Your login session has expired, please log in again. ");
          get().clearState();
        } finally {
          set({
            loading: false,
          });
        }
      },
      authLogout: async () => {
        try {
          await authService.authLogout();
          get().clearState();
          toast.success("Logout Successful !!!");
        } catch (err) {
          console.log(err);
          toast.error("Something Went Wrong When Logout");
        }
      },
      authGitHub: async () =>{
        try {
          const res = await authService.authGitHub();
          window.location.href = res.url;
        } catch (err) {
          console.log(err);
          toast.error("Something Went Wrong When Login With GitHub");
        }
      }
    }),
    {
      name: "auth-storage",
      partialize: (s) => ({ user: s.user }),
    },
  ),
);
