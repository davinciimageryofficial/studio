
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppSidebar } from "@/components/layout/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { GlobalSearch } from "@/components/layout/global-search";
import { ClientOnly } from "@/components/layout/client-only";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
      <body className={`${inter.variable} font-body antialiased`}>
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
        </SidebarProvider>
      </body>
    </html>
  );
}
