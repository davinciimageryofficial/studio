import { Inter, Michroma } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Providers } from "./providers";
import { ClientOnly } from "@/components/layout/client-only";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LayoutBody } from "@/components/layout/layout-body";
import { getCurrentUser } from "@/lib/database";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const michroma = Michroma({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-michroma',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Sentry</title>
        <meta name="description" content="Your professional network and dream team builder." />
      </head>
      <body className={`${inter.variable} ${michroma.variable} font-body antialiased`}>
        <Providers>
            <LayoutBody currentUser={currentUser}>{children}</LayoutBody>
            <Toaster />
            <Analytics />
            <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
