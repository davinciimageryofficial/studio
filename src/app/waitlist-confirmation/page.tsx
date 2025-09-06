
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Mail, Kanban, Briefcase, Heart } from "lucide-react";
import { ClientOnly } from "@/components/layout/client-only";
import { Fireworks } from "@/components/ui/fireworks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

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
    } else {
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

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <ClientOnly>
      <div className="relative flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-muted/40 p-4 overflow-hidden">
        <Fireworks />
        <Card className="w-full max-w-lg text-center shadow-2xl z-10">
          <CardHeader className="p-6">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
              <CheckCircle className="size-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tighter">You're In!</CardTitle>
            <CardDescription className="mt-1 text-lg text-muted-foreground">
              Thank you for joining the Sentry waitlist. We've received your information.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-3 rounded-lg border bg-background p-4 text-left">
              <h3 className="font-semibold text-md mb-2">Your Submitted Information:</h3>
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="font-medium text-sm">{waitlistData.fullName}</p>
                </div>
              </div>
               <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{waitlistData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Profession</p>
                  <p className="font-medium text-sm capitalize">{waitlistData.profession}</p>
                </div>
              </div>
              {waitlistData.earlyAccess && (
                 <div className="flex items-center gap-4">
                  <Kanban className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Early Access</p>
                    <p className="font-medium text-sm">You'll be notified about beta testing opportunities!</p>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">We'll send an email to <span className="font-medium">{waitlistData.email}</span> when it's your turn to join.</p>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full" size="lg">Back to Homepage</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <DialogTitle className="text-2xl">Support Sentry's Development</DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Sentry is built for the community, by the community. Your support helps us innovate faster and build the best platform for professionals like you.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
                  <Button size="lg" onClick={() => handleNavigation('/billing?tab=donate')}>
                    Support the Platform
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="ghost" size="lg" onClick={() => handleNavigation('/')}>
                      Go to Homepage
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </CardContent>
        </Card>
      </div>
    </ClientOnly>
  );
}
