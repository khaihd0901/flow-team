import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Outlet } from "react-router";

import { AppSidebar } from "./app-sidebar";

import ThemeToggle from "../ThemeToggle";

import NotificationBell from "../notification/NotificationBell";
import NotificationResult from "../notification/NotificationResult";

import ChatIconButton from "../chat/ChatIconButton";
import ChatDropdown from "../chat/ChatDropdown";

import UserSearch from "../search/UserSearch";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [openNotification, setOpenNotification] = useState(false);

  const [openChat, setOpenChat] = useState(false);
  const notificationRef = useRef(null);
  const chatRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotification(false);
      }

      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setOpenChat(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header
          className="
            sticky
            top-0
            z-40

            mb-4

            flex
            shrink-0
            items-center
            gap-2

            border-b
            bg-background
            p-2
          "
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <UserSearch />
          </div>

          <div className="ml-auto flex gap-1 px-3">
            {/* NOTIFICATION */}

            <div ref={notificationRef} className="relative">
              <NotificationBell
                count={1}
                hasNew={false}
                onClick={() => setOpenNotification((prev) => !prev)}
              />

              <NotificationResult open={openNotification} />
            </div>

            {/* CHAT */}

            <div ref={chatRef} className="relative">
              <ChatIconButton
                count={1}
                hasNew={false}
                onClick={() => setOpenChat((prev) => !prev)}
              />

              <ChatDropdown open={openChat} setOpen={setOpenChat} />
            </div>

            <ThemeToggle />
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
