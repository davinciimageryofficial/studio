
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
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useWorkspace } from "@/context/workspace-context";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { placeholderUsers } from "@/lib/placeholder-data";
import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";

export function AppSidebar() {
  const pathname = usePathname();
  const { language, isHydrated } = useLanguage();
  
  if (!isHydrated) {
    // Render nothing or a placeholder until the language is hydrated
    return null; 
  }

  const t = translations[language];

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
  const currentUser = placeholderUsers[1];
  const { state } = useSidebar();
  
  const getLabel = () => {
    if (state === 'collapsed') return t.sidebarExpand;
    return t.sidebarCollapse;
  }

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
                 <SidebarTrigger className="w-full justify-start">
                    <PanelLeft className="duration-200 group-data-[state=expanded]:rotate-180" />
                    <span>{getLabel()}</span>
                 </SidebarTrigger>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t.sidebarMyProfile} className="justify-start">
                <Link href="/profile/me">
                    <UserCircle className="hidden group-data-[collapsible=icon]:block" />
                    <Avatar className="size-7 group-data-[collapsible=icon]:hidden">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{t.sidebarMyProfile}</span>
                </Link>
              </SidebarMenuButton>
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
