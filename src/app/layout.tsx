
import type { Metadata } from "next";
import { Inter, Michroma, Source_Serif_4 } from "next/font/google";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { GlobalSearch } from "@/components/layout/global-search";
import { ClientOnly } from "@/components/layout/client-only";
import { WorkspaceProvider } from "@/context/workspace-context";
import { CallWidget } from "@/components/layout/call-widget";
import { NavigationPrompt } from "@/components/layout/navigation-prompt";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const michroma = Michroma({ weight: ["400"], subsets: ["latin"], variable: "--font-michroma" });
const sourceSerif4 = Source_Serif_4({ subsets: ["latin"], weight: "700", variable: "--font-source-serif-4" });


export const metadata: Metadata = {
  title: "Sentry",
  description: "Your professional network and dream team builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${michroma.variable} ${sourceSerif4.variable} font-body antialiased`}>
        <WorkspaceProvider>
          <SidebarProvider>
            <ClientOnly>
              <AppSidebar />
            </ClientOnly>
            <SidebarInset>
              <div className="flex flex-col">
                <ClientOnly>
                  <GlobalSearch />
                </ClientOnly>
                <div className="flex-1">{children}</div>
              </div>
            </SidebarInset>
            <Toaster />
            <ClientOnly>
                <CallWidget />
                <NavigationPrompt />
            </ClientOnly>
          </SidebarProvider>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
