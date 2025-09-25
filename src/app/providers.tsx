
"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkspaceProvider } from "@/context/workspace-context";
import { LanguageProvider } from "@/context/language-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      themes={["light", "dark", "midnight"]}
    >
        <LanguageProvider>
            <WorkspaceProvider>
                {children}
            </WorkspaceProvider>
        </LanguageProvider>
    </ThemeProvider>
  );
}
