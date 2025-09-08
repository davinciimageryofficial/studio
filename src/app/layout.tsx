
"use client";

import type { Metadata } from "next";
import { Inter, Michroma } from "next/font/google";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { GlobalSearch } from "@/components/layout/global-search";
import { ClientOnly } from "@/components/layout/client-only";
import { WorkspaceProvider } from "@/context/workspace-context";
import { CallWidget } from "@/components/layout/call-widget";
import { NavigationPrompt } from "@/components/layout/navigation-prompt";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const michroma = Michroma({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-michroma',
});

// export const metadata: Metadata = {
//   title: "Sentry",
//   description: "Your professional network and dream team builder.",
// };

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const publicPages = ['/', '/signup', '/waitlist-confirmation', '/logout', '/donate'];
  const isPublicPage = publicPages.includes(pathname);

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
      <SidebarProvider>
        <ClientOnly>
          <AppSidebar />
        </ClientOnly>
        <SidebarInset>
          <div className="flex flex-col h-screen">
            <ClientOnly>
              <GlobalSearch />
            </ClientOnly>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <title>Sentry</title>
        <meta name="description" content="Your professional network and dream team builder." />
      </head>
      <body className={`${inter.variable} ${michroma.variable} font-body antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" themes={['light', 'dark', 'grey']}>
          <WorkspaceProvider>
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster />
            <ClientOnly>
                <CallWidget />
                <NavigationPrompt />
            </ClientOnly>
          </WorkspaceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
