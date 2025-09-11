
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Mail, Kanban, Briefcase, Heart, Rocket } from "lucide-react";
import { ClientOnly } from "@/components/layout/client-only";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

type WaitlistData = {
  fullName: string;
  email: string;
  profession: string;
  earlyAccess: boolean;
};

export default function WaitlistConfirmationPage() {
  const router = useRouter();
  const [waitlistData, setWaitlistData] = useState<WaitlistData | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const data = localStorage.getItem("waitlistData");
    if (data) {
      setWaitlistData(JSON.parse(data));
    } else {
      router.push('/signup');
    }
  }, [router]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  
  const handleAccessCodeSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (accessCode === '2004') {
        toast({
            title: "Access Granted!",
            description: "Welcome to Sentry! You've skipped the waitlist.",
        });
        router.push('/dashboard');
    } else {
        toast({
            variant: "destructive",
            title: "Invalid Code",
            description: "The access code you entered is incorrect. Please try again.",
        });
    }
  };

  if (!waitlistData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {/* You can add a loading spinner here */}
      </div>
    );
  }


  return (
    <ClientOnly>
       <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <div className="w-full">
                 <Card className="w-full max-w-lg mx-auto text-center border-0 shadow-none">
                    <CardHeader className="p-6">
                        <CardTitle className="text-3xl font-bold tracking-tighter">You're In!</CardTitle>
                        <CardDescription className="mt-1 text-lg text-muted-foreground">
                        Thank you for joining the Sentry waitlist. We've received your information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 space-y-0">
                        <div className="space-y-3 rounded-lg bg-card p-4 text-left">
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
                        
                        <Card className="text-left mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Have an Access Code?</CardTitle>
                                <CardDescription>Enter your code below to skip the line and get immediate access.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAccessCodeSubmit} className="flex gap-2">
                                    <Input 
                                        placeholder="Enter your access code" 
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                        className="border-black"
                                    />
                                    <Button type="submit" className="bg-black hover:bg-gray-800">
                                        <Rocket className="mr-2 h-4 w-4" />
                                        Skip Waitlist
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <p className="text-xs text-muted-foreground mt-4">We'll send an email to <span className="font-medium">{waitlistData.email}</span> when it's your turn to join.</p>
                        
                        <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-black hover:bg-gray-800 text-primary-foreground mt-4" size="lg">Back to Homepage</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                <Heart className="h-6 w-6 text-primary" />
                            </div>
                            <DialogTitle className="text-2xl">Support Sentry's Development</DialogTitle>
                            <DialogDescription className="text-base text-muted-foreground">
                                Sentry is built for the community, by the community. Your support helps us innovate faster and build the best platform for professionals like you.
                            </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
                            <Button size="lg" onClick={() => handleNavigation('/donate')}>
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
      </div>
    </ClientOnly>
  );
}
