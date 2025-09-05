
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
  Book,
  Radar,
  MessageSquare,
  Newspaper,
  UserCircle,
  Settings,
  LogOut,
  PanelLeft,
  CreditCard,
  Home,
  Mic,
  Fullscreen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useWorkspace } from "@/context/workspace-context";
import { useFullscreen } from "@/hooks/use-fullscreen";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/feed", label: "Feed", icon: LayoutGrid },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/discover", label: "Discover", icon: Search },
];

const productivityItems = [
    { href: "/workspaces", label: "Workspaces", icon: Mic },
    { href: "/workmate-radar", label: "Workmate Radar", icon: Radar },
];

const contentItems = [
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/connect", label: "Courses", icon: Book },
]

const secondaryMenuItems = [
    { href: "/billing", label: "Billing", icon: CreditCard },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setNextPath, isActive: isSessionActive } = useWorkspace();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const isActive = (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href) && href !== "/");

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname.startsWith('/workspaces') && isSessionActive) {
        e.preventDefault();
        setNextPath(href);
    }
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left">
      <SidebarHeader>
        <div className="flex w-full items-center justify-between p-2">
            <div className="flex items-center gap-2 font-headline-tech [&>span]:font-bold [&>span]:text-lg [&>span]:tracking-wide">
                <svg className="size-7" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" opacity="0.2"></path>
                    <path d="M152.2,60.2a52,52,0,0,0-73.5,73.5l-2.3,2.3a12,12,0,0,0,0,17,12,12,0,0,0,17,0l2.3-2.3a52,52,0,0,0,73.5-73.5l2.3-2.3a12,12,0,0,0-17-17ZM135.2,149a28,28,0,0,1-39.6-39.6l19.8-19.8a28,28,0,0,1,39.6,39.6Z"></path>
                    <path d="M103.8,195.8a52,52,0,0,0,73.5-73.5l2.3-2.3a12,12,0,0,0-17-17l-2.3,2.3a52,52,0,0,0-73.5,73.5l-2.3,2.3a12,12,0,1,0,17,17Z" opacity="0.2"></path>
                    <path d="M198,34s-4,6-8,8-10,0-10,0l-2,4a80.14,80.14,0,0,0-28,16l-4-2s-6-4-8-2-4,10-4,10l-4,2a80.14,80.14,0,0,0-16,28l-2,4s-4-4-10-4-8,2-8,2l-4,2a80.14,80.14,0,0,0-16,28l-2,4s-6-4-8-2-4,10-4,10l-2,4a80.14,80.14,0,0,0,16,28l4,2s4,6,2,8,10,4,10,4l4-2a80.14,80.14,0,0,0,28-16l2-4s4,4,10,4,8-2,8-2l4-2a80.14,80.14,0,0,0,28-16l2-4s4-4,8-2,4,10,4,10l2-4a80.14,80.14,0,0,0,16-28l2-4s-4-6-2-8-10-4-10-4l-4,2a80.14,80.14,0,0,0-28,16l-2,4s-4,4-8,2-4-10-4-10l-2-4a80.14,80.14,0,0,0-16-28Z" opacity="0.2"></path>
                </svg>
                <span className="duration-200 group-data-[collapsible=icon]:-ml-8 group-data-[collapsible=icon]:opacity-0">SENTRY</span>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 justify-center">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
                className="justify-start"
              >
                <Link href={item.href} onClick={(e) => handleLinkClick(e, item.href)}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu>
             {productivityItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                    className="justify-start"
                >
                    <Link href={item.href} onClick={(e) => handleLinkClick(e, item.href)}>
                    <item.icon />
                    <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
         <SidebarMenu>
             {contentItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                    className="justify-start"
                >
                    <Link href={item.href} onClick={(e) => handleLinkClick(e, item.href)}>
                    <item.icon />
                    <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
        <SidebarMenu>
          {secondaryMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
                className="justify-start"
              >
                <Link href={item.href} onClick={(e) => handleLinkClick(e, item.href)}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
             <SidebarMenuItem>
                <SidebarTrigger className="w-full justify-start" />
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                onClick={toggleFullscreen}
                tooltip={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                className="justify-start"
              >
                <Fullscreen />
                <span>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile" className="justify-start">
                <Link href="/profile/me">
                    <UserCircle className="hidden group-data-[collapsible=icon]:block" />
                    <Avatar className="size-7 group-data-[collapsible=icon]:hidden">
                      <AvatarImage src="https://picsum.photos/id/1005/40/40" data-ai-hint="man portrait" />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">My Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === '/settings'} className="justify-start">
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Logout" className="justify-start">
                <Link href="/logout">
                  <LogOut />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
