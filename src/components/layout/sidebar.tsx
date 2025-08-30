"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  Search,
  Users,
  Radar,
  MessageSquare,
  Newspaper,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const menuItems = [
  { href: "/", label: "Feed", icon: LayoutGrid },
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/connect", label: "Connect", icon: Users },
  { href: "/workmate-radar", label: "Workmate Radar", icon: Radar },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/news", label: "News", icon: Newspaper },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href));

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex w-full items-center justify-between p-2">
            <div className="flex items-center gap-2 [&>span]:font-bold [&>span]:text-lg [&>span]:tracking-wide">
                <svg className="size-7" fill="currentColor" viewBox="0 0 256 256"><path d="M152,24a80,80,0,1,0,59.4,136H152V88a8,8,0,0,0-16,0v72H68.6a80,80,0,1,0,83.4-136ZM128,200a64,64,0,1,1,64-64A64.07,64.07,0,0,1,128,200Z"></path></svg>
                <span className="duration-200 group-data-[collapsible=icon]:-ml-8 group-data-[collapsible=icon]:opacity-0">SENTRY</span>
            </div>
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/profile/me" legacyBehavior passHref>
                  <SidebarMenuButton tooltip="Profile">
                      <Avatar className="size-7">
                        <AvatarImage src="https://picsum.photos/id/1005/40/40" data-ai-hint="man portrait" />
                        <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">My Profile</span>
                  </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
