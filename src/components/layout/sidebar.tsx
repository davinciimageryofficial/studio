
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
  useSidebar,
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
  PanelLeft,
  CreditCard,
  Home,
  Mic,
  Fullscreen,
  Briefcase,
  Kanban,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useWorkspace } from "@/context/workspace-context";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useLanguage } from "@/context/language-context";
import { getTranslations } from "@/lib/translations";
import { useEffect, useState } from "react";
import type { User as UserType } from "@/lib/types";

export function AppSidebar({ currentUser }: { currentUser: UserType | null }) {
  const pathname = usePathname();
  const { language, isLoaded } = useLanguage();
  
  if (!isLoaded) {
    // Render a skeleton or null while translations are loading
    return (
        <Sidebar variant="sidebar" collapsible="icon" side="left">
             <SidebarHeader />
             <SidebarContent />
             <SidebarFooter />
        </Sidebar>
    ); 
  }

  const t = getTranslations(language);

  const menuItems = [
    { href: "/dashboard", label: t.sidebarDashboard, icon: Home },
    { href: "/feed", label: t.sidebarFeed, icon: LayoutGrid },
    { href: "/messages", label: t.sidebarMessages, icon: MessageSquare },
    { href: "/discover", label: t.sidebarDiscover, icon: Search },
  ];

  const productivityItems = [
      { href: "/workspaces", label: t.sidebarWorkspaces, icon: Mic },
      { href: "/workmate-radar", label: t.sidebarWorkmateRadar, icon: Radar },
      { href: "/skill-sync-net", label: t.sidebarSkillSyncNet, icon: Briefcase },
  ];

  const contentItems = [
      { href: "/news", label: t.sidebarNews, icon: Newspaper },
      { href: "/connect", label: t.sidebarCourses, icon: Book },
  ]

  const secondaryMenuItems = [
      { href: "/billing", label: t.sidebarBilling, icon: CreditCard },
  ];

  const { setNextPath, isActive: isSessionActive } = useWorkspace();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href) && href !== "/dashboard");
  
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
                <Kanban className="h-full" />
                <span className="duration-200 group-data-[collapsible=icon]:-ml-8 group-data-[collapsible=icon]:opacity-0">SENTRY</span>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
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
                <SidebarMenuButton
                    onClick={toggleFullscreen}
                    tooltip={isFullscreen ? t.sidebarExitFullscreen : t.sidebarFullscreen}
                    className="w-full justify-start"
                >
                    <Fullscreen />
                    <span>{isFullscreen ? t.sidebarExitFullscreen : t.sidebarFullscreen}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                 <SidebarTrigger className="w-full justify-start" />
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/profile/me">
                    <SidebarMenuButton tooltip={t.sidebarMyProfile} className="justify-start h-12 text-sm">
                        <Avatar className="size-8">
                        <AvatarImage src={currentUser?.avatar} />
                        <AvatarFallback>
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start duration-200 group-data-[collapsible=icon]:-ml-8 group-data-[collapsible=icon]:opacity-0">
                            <span className="text-sm font-medium">{currentUser?.name || 'Guest'}</span>
                            <span className="text-xs text-sidebar-foreground/70">{t.sidebarMyProfile}</span>
                        </div>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t.settings} isActive={pathname === '/settings'} className="justify-start">
                <Link href="/settings">
                  <Settings />
                  <span>{t.settings}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
