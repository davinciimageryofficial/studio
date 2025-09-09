
"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkspaceProvider } from "@/context/workspace-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      themes={["light", "dark", "midnight"]}
    >
      <WorkspaceProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}
