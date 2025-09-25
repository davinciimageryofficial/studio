
"use client";

import { AppSidebar } from "@/components/layout/sidebar";
import { GlobalSearch } from "@/components/layout/global-search";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { User } from "@/lib/types";

export function AppLayout({
  children,
  currentUser,
}: Readonly<{
  children: React.ReactNode;
  currentUser: User | null;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar currentUser={currentUser} />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <GlobalSearch />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
