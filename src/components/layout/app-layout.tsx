
"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/sidebar";
import { GlobalSearch } from "@/components/layout/global-search";
import { SidebarInset } from "@/components/ui/sidebar";
import { ClientOnly } from "@/components/layout/client-only";
import { NavigationPrompt } from "@/components/layout/navigation-prompt";

export function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const publicPages = ['/', '/login', '/signup', '/waitlist-confirmation', '/logout', '/donate', '/faq'];
  const isPublicPage = publicPages.some(page => pathname === page);

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
      <ClientOnly>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col h-screen">
            <GlobalSearch />
            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>
        </SidebarInset>
        <NavigationPrompt />
      </ClientOnly>
  )
}
