
"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { AppLayout } from "@/components/layout/app-layout";
import { CallWidget } from "./call-widget";

export function LayoutBody({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoaded } = useLanguage();
  const publicPages = ['/', '/login', '/signup', '/waitlist-confirmation', '/logout', '/donate', '/faq'];
  const isPublicPage = publicPages.includes(pathname);

  if (!isLoaded) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            {/* You can add a more sophisticated loading spinner here */}
        </div>
    );
  }

  return (
    <>
      {isPublicPage ? (
        children
      ) : (
        <AppLayout>
          {children}
        </AppLayout>
      )}
      <CallWidget />
    </>
  );
}
