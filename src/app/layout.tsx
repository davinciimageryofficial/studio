
"use client";

import { Inter, Michroma } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { Providers } from "./providers";
import { ClientOnly } from "@/components/layout/client-only";
import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const michroma = Michroma({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-michroma',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const publicPages = ['/', '/login', '/signup', '/waitlist-confirmation', '/logout', '/donate', '/faq'];
  const isPublicPage = publicPages.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <title>Sentry</title>
        <meta name="description" content="Your professional network and dream team builder." />
      </head>
      <body className={`${inter.variable} ${michroma.variable} font-body antialiased`}>
        <Providers>
          {isPublicPage ? (
            <>{children}</>
          ) : (
            <AppLayout>
              {children}
            </AppLayout>
          )}
          <ClientOnly>
              <Toaster />
          </ClientOnly>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
