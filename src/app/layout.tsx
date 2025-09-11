
import { Inter, Michroma } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { Providers } from "./providers";
import { ClientOnly } from "@/components/layout/client-only";

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
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <title>Sentry</title>
        <meta name="description" content="Your professional network and dream team builder." />
      </head>
      <body className={`${inter.variable} ${michroma.variable} font-body antialiased`}>
        <Providers>
            <AppLayout>
              {children}
            </AppLayout>
            <ClientOnly>
                <Toaster />
            </ClientOnly>
        </Providers>
      </body>
    </html>
  );
}
