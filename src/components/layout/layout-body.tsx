
"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { AppLayout } from "@/components/layout/app-layout";
import { CallWidget } from "./call-widget";
import type { User } from "@/lib/types";

export function LayoutBody({ 
  children,
  currentUser 
}: { 
  children: React.ReactNode,
  currentUser: User | null
}) {
  const pathname = usePathname();
  const { isLoaded } = useLanguage();

  const publicPages = ['/', '/login', '/signup', '/waitlist-confirmation', '/logout', '/faq', '/donate'];
  const isPublicPage = publicPages.includes(pathname);

  if (!isLoaded) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            {/* You can add a more sophisticated loading spinner here */}
        </div>
    );
  }

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <>
      <AppLayout currentUser={currentUser}>
        {children}
      </AppLayout>
      <CallWidget />
    </>
  );
}
