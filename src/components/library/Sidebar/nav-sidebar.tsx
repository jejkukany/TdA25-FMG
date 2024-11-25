"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  CircleHelp,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  PlayIcon,
  Send,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/library/Sidebar/nav-main"
import { NavSecondary } from "@/components/library/Sidebar/nav-secondary"
import { NavUser } from "@/components/library/Sidebar/nav-user"	
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Guest",
    email: "No email",
    avatar: "./user.png",
  },
  navMain: [
    {
      title: "Hrát",
      url: "#",
      icon: PlayIcon,
      isActive: true,
      items: [
        {
          title: "Rychlá hra",
          url: "/game",
        },
      ],
    },
    {
      title: "O nás",
      url: "#",
      icon: CircleHelp,
      items: [
        {
          title: "Jak tento projekt vzniknul?",
          url: "#",
        },
        {
          title: "Kdo jsme",
          url: "#",
        },
        {
          title: "Linky",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Tic-Tac-Toe</span>
                  <span className="truncate text-xs">Presented by FMG</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
