"use client";

import * as React from "react";
import { NavProjects } from "@/components/Layout/nav-projects";
import { NavUser } from "@/components/Layout/nav-user";
import { TeamSwitcher } from "@/components/Layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { FrameIcon, PieChartIcon, MapIcon } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import CreateNewGroupChat from "../chat/CreateNewGroupChat";
import GroupChatList from "../chat/GroupChatList";
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { user } = useAuthStore();
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* header */}
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      {/* content */}
      <SidebarContent>
        {/* projects */}
        <NavProjects projects={data.projects} />

        {/* group chats */}
        {state !== "collapsed" && (
          <SidebarGroup>
            <SidebarGroupLabel className={"capitalize"}>
              group chat
            </SidebarGroupLabel>
            <SidebarGroupAction>
              <CreateNewGroupChat />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <GroupChatList />
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>
      {/* footer */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
