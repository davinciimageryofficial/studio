
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
                <svg className="size-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8H4C4 4 8 4 8 8ZM8 8V12C8 16 4 16 4 12H8ZM8 8H12C16 8 16 4 12 4V8H8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 16H20C20 20 16 20 16 16ZM16 16V12C16 8 20 8 20 12H16ZM16 16H12C8 16 8 20 12 20V16H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
