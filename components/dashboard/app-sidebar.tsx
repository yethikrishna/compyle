"use client";

import { NavMain } from "@/components/custom/nav-main";
import {
  ArrowUpRight,
  CornerUpLeft,
  Frame,
  GitPullRequestCreateArrow,
  House,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  SquareTerminal,
} from "lucide-react";
import * as React from "react";
// import { NavProjects } from "@/components/nav-projects";
// import { NavSecondary } from "@/components/nav-secondary";
// import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { NavSecondary } from "../custom/nav-secondary";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: House },
    {
      title: "Apps",
      url: "/dashboard/apps",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Your Apps",
          url: "/dashboard/apps/me",
        },
        {
          title: "Create App",
          url: "/dashboard/apps/new",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "All Apps",
      url: "/apps",
      icon: CornerUpLeft,
    },
    {
      title: "Compyle.ai",
      url: "https://www.compyle.ai",
      icon: ArrowUpRight,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary/25 flex items-center justify-center rounded-md p-1 border border-primary/50">
                  <GitPullRequestCreateArrow />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Compyle Apps</span>
                  <span className="truncate text-xs">User Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/*<NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
