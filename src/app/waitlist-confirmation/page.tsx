
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Mail, Briefcase } from "lucide-react";
import { ClientOnly } from "@/components/layout/client-only";
import { Fireworks } from "@/components/ui/fireworks";

type WaitlistData = {
  fullName: string;
  email: string;
  profession: string;
  earlyAccess: boolean;
};

export default function WaitlistConfirmationPage() {
  const router = useRouter();
  const [waitlistData, setWaitlistData] = useState<WaitlistData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("waitlistData");
    if (data) {
      setWaitlistData(JSON.parse(data));
      // Optional: Clear the data from localStorage after reading it
      // localStorage.removeItem("waitlistData");
    } else {
      // If no data, redirect to signup
      router.push('/signup');
    }
  }, [router]);

  if (!waitlistData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {/* You can add a loading spinner here */}
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="relative flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-muted/40 p-4 overflow-hidden">
        <Fireworks />
        <Card className="w-full max-w-lg text-center shadow-2xl z-10">
          <CardHeader className="p-8 sm:p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
              <CheckCircle className="size-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tighter">You're In!</CardTitle>
            <CardDescription className="mt-2 text-lg text-muted-foreground">
              Thank you for joining the Sentry waitlist. We've received your information.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-4 rounded-lg border bg-background p-6 text-left">
              <h3 className="font-semibold text-lg mb-4">Your Submitted Information:</h3>
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{waitlistData.fullName}</p>
                </div>
              </div>
               <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{waitlistData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Profession</p>
                  <p className="font-medium capitalize">{waitlistData.profession}</p>
                </div>
              </div>
              {waitlistData.earlyAccess && (
                 <div className="flex items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-muted-foreground"><circle cx="12" cy="12" r="7"></circle><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                  <div>
                    <p className="text-sm text-muted-foreground">Early Access</p>
                    <p className="font-medium">You'll be notified about beta testing opportunities!</p>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">We'll send an email to <span className="font-medium">{waitlistData.email}</span> when it's your turn to join.</p>
            <Button onClick={() => router.push('/')} className="mt-8 w-full" size="lg">Back to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    </ClientOnly>
  );
}
