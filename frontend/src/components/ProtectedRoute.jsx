import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, user, loading, authRefreshToken, authMe } = useAuthStore();
  const [starting, setStarting] = useState(true);
  const hasRun = useRef(false);
  const init = async () => {
    if (!accessToken) {
      await authRefreshToken();
    }

    if (accessToken && !user) {
      console.log("do not have user")
      await authMe();
    }
    setStarting(false)
  };

useEffect(() => {
  if (hasRun.current) return;
  hasRun.current = true;

  init();
}, []);

  if(starting || loading){
    return <div className="flex h-screen items-center justify-center">Loading ...</div>
  }
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet> </Outlet>;
};

export default ProtectedRoute;
