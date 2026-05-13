import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MainBoard from "./pages/MainBoard";
import ForgotPassword from "./pages/ForgotPassword";

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

import { ChatProvider } from "@/Contexts/chatContext";
import { useSocketStore } from "./stores/socketStore";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
function App() {
    const { connectSocket, disconnectSocket } = useSocketStore();
  const { accessToken } = useAuthStore();

  
  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken]);

  return (
    <ChatProvider>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ForgotPassword />} />
          </Route>

          {/* PRIVATE */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<MainBoard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ChatProvider>
  );
}

export default App;