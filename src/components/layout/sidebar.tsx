
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
                <svg className="size-7" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M208,32H48A16,16,0,0,0,32,48V160a16,16,0,0,0,16,16H80v32a16,16,0,0,0,24.4,14.5l40-24A15.9,15.9,0,0,0,152,184V176h24a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,128H176V128a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v32H48V48H208Zm-48-48a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h40A8,8,0,0,1,160,112Z"/>
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
