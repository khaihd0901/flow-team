
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "./app-sidebar";
import ThemeToggle from "../ThemeToggle";
import NotificationBell from "../NotificationBell";
import UserSearch from "../search/UserSearch";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-2 mb-4">
          <div className="flex items-center  gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* User search */}
            <UserSearch/>
          </div>
          <div className="flex gap-1 ml-auto px-3">
            <NotificationBell
              count={1}
              hasNew={false}
              onClick={() => console.log("open notifications")} /*  */
            />
            <ThemeToggle />
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
