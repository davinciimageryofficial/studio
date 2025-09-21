
import { AppSidebar } from "@/components/layout/sidebar";
import { GlobalSearch } from "@/components/layout/global-search";
import { SidebarInset } from "@/components/ui/sidebar";
import { ClientOnly } from "@/components/layout/client-only";
import { NavigationPrompt } from "@/components/layout/navigation-prompt";
import { getCurrentUser } from "@/lib/database";
import type { User } from "@/lib/types";

// AppLayout is now a Server Component that fetches data.
export async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
      <ClientOnly>
        <AppSidebar currentUser={currentUser} />
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
