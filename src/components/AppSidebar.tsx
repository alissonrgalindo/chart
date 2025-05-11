"use client"

import * as React from "react"
import { useLocation, Link } from "react-router-dom"
import {
  BarChartIcon,
  LayoutDashboardIcon,
  UserCircleIcon,
} from "lucide-react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail } from "@/components/ui/sidebar"
import { CreateCampaignDialog  } from "@/components/CreateCampaignDialog"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  const menuItems = [
    {
      title: "Campaigns",
      url: "/campaigns",
      icon: BarChartIcon,
    },
    {
      title: "Overview",
      url: "/overview",
      icon: LayoutDashboardIcon,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <UserCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">My App</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <CreateCampaignDialog />
          </SidebarMenuItem>

          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={
                  location.pathname === item.url
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : ""
                }
              >
                <Link to={item.url}>
                  <item.icon className="shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings">
                <UserCircleIcon />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
