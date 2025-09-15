
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
import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const { language } = useLanguage();
  const t = translations[language];

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
            title: t.accessGrantedToastTitle,
            description: t.accessGrantedToastDesc,
        });
        router.push('/dashboard');
    } else {
        toast({
            variant: "destructive",
            title: t.invalidCodeToastTitle,
            description: t.invalidCodeToastDesc,
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
                        <CardTitle className="text-3xl font-bold tracking-tighter">{t.confirmationTitle}</CardTitle>
                        <CardDescription className="mt-1 text-lg text-muted-foreground">
                        {t.confirmationDescription}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 space-y-4">
                        <Alert>
                            <Mail className="h-4 w-4" />
                            <AlertTitle>Verify Your Email</AlertTitle>
                            <AlertDescription>
                                We've sent a confirmation link to <strong>{waitlistData.email}</strong>. Please check your inbox and spam folder to verify your account before logging in.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-3 rounded-lg bg-card p-4 text-left border">
                        <h3 className="font-semibold text-md mb-2">{t.confirmationSubmittedInfo}</h3>
                        <div className="flex items-center gap-4">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                            <p className="text-xs text-muted-foreground">{t.signupFullName}</p>
                            <p className="font-medium text-sm">{waitlistData.fullName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                            <div>
                            <p className="text-xs text-muted-foreground">{t.signupProfession}</p>
                            <p className="font-medium text-sm capitalize">{waitlistData.profession}</p>
                            </div>
                        </div>
                        {waitlistData.earlyAccess && (
                            <div className="flex items-center gap-4">
                            <Kanban className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">{t.confirmationEarlyAccess}</p>
                                <p className="font-medium text-sm">{t.confirmationEarlyAccessDesc}</p>
                            </div>
                            </div>
                        )}
                        </div>
                        
                        <Card className="text-left mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">{t.confirmationHaveCode}</CardTitle>
                                <CardDescription>{t.confirmationHaveCodeDesc}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAccessCodeSubmit} className="flex gap-2">
                                    <Input 
                                        placeholder={t.confirmationAccessCodePlaceholder} 
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                        className="border-black"
                                    />
                                    <Button type="submit" className="bg-black hover:bg-gray-800">
                                        <Rocket className="mr-2 h-4 w-4" />
                                        {t.confirmationSkipWaitlist}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <p className="text-xs text-muted-foreground pt-2">Note: To simplify development, you can disable email confirmation in your Supabase project's Authentication settings.</p>
                        
                        <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-black hover:bg-gray-800 text-primary-foreground mt-4" size="lg">{t.confirmationBackToHome}</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                <Heart className="h-6 w-6 text-primary" />
                            </div>
                            <DialogTitle className="text-2xl">{t.confirmationSupportTitle}</DialogTitle>
                            <DialogDescription className="text-base text-muted-foreground">
                                {t.confirmationSupportDesc}
                            </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
                            <Button size="lg" onClick={() => handleNavigation('/donate')}>
                                {t.confirmationSupportButton}
                            </Button>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost" size="lg" onClick={() => handleNavigation('/')}>
                                {t.confirmationGoHomeButton}
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
