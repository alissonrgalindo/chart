import * as React from "react"
import { useLocation, Link } from "react-router-dom"
import {
  BarChartIcon,
  LayoutDashboardIcon,
  HomeIcon,
} from "lucide-react"

import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarRail,
  SidebarSeparator,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { CreateCampaignDialog } from "@/components/CreateCampaignDialog"
import { useCampaigns } from "@/hooks/useCampaigns"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const { campaigns } = useCampaigns()
  
  const navItems = [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
      exact: true,
    },
    {
      title: "Overview",
      url: "/overview",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Campaigns",
      url: "/campaigns",
      icon: BarChartIcon,
      badge: campaigns.length > 0 ? campaigns.length : undefined,
    }
  ]

  const isActive = (item: { url: string, exact?: boolean }) => {
    if (item.exact) {
      return location.pathname === item.url;
    }
    return location.pathname === item.url || location.pathname.startsWith(item.url + '/');
  };

  const renderNavItems = (items: typeof navItems) => {
    return items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          isActive={isActive(item)}
          tooltip={item.title}
        >
          <Link to={item.url}>
            <item.icon className="size-5" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
        {item.badge && (
          <SidebarMenuBadge>
            {item.badge}
          </SidebarMenuBadge>
        )}
      </SidebarMenuItem>
    ));
  };



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
                <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-md h-8 w-8 min-w-[23px]">
                  <span className="text-lg font-bold">C</span>
                </div>
                <span className="text-base font-semibold">Campaign Hub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-2 overflow-hidden">
        <SidebarMenu className="mb-2">
          <SidebarMenuItem>
            <CreateCampaignDialog />
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarMenu>
          {renderNavItems(navItems)}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}