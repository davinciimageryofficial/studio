
"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { AppLayout } from "@/components/layout/app-layout";
import { CallWidget } from "./call-widget";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/database";
import type { User } from "@/lib/types";

export function LayoutBody({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoaded } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setIsAuthCheckComplete(true);
    }
    fetchUser();
  }, []);

  const publicPages = ['/', '/login', '/signup', '/waitlist-confirmation', '/logout', '/donate', '/faq'];
  const isPublicPage = publicPages.includes(pathname);

  if (!isLoaded || !isAuthCheckComplete) {
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
        <AppLayout currentUser={currentUser}>
          {children}
        </AppLayout>
      )}
      <CallWidget />
    </>
  );
}
