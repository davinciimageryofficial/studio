
import { Inter, Michroma } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { Providers } from "./providers";
import { ClientOnly } from "@/components/layout/client-only";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const michroma = Michroma({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-michroma',
});

function RootLayoutInternal({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoaded } = useLanguage();
  const publicPages = ['/', '/login', '/signup', '/waitlist-confirmation', '/logout', '/donate', '/faq'];
  const isPublicPage = publicPages.includes(pathname);

  if (!isLoaded) {
    return (
        <body className={`${inter.variable} ${michroma.variable} font-body antialiased`}>
            {/* Render nothing or a loading spinner to avoid flash of unstyled content */}
        </body>
    );
  }

  return (
    <body className={`${inter.variable} ${michroma.variable} font-body antialiased`}>
        {isPublicPage ? (
            <>
                {children}
            </>
        ) : (
            <AppLayout>
              {children}
            </AppLayout>
        )}
        <ClientOnly>
            <Toaster />
        </ClientOnly>
        <Analytics />
        <SpeedInsights />
    </body>
  );
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
        <Providers>
            <RootLayoutInternal>{children}</RootLayoutInternal>
        </Providers>
    </html>
  );
}
