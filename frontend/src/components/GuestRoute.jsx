import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/authStore";

export default function GuestRoute() {
  const { accessToken, user } = useAuthStore();
  // logged in
  if (accessToken || user) {
    return <Navigate to="/" replace />;
  }

  // not logged in
  return <Outlet />;
}