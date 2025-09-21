
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Briefcase, LogOut, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, Language, availableLanguages } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, updateUserProfile } from '@/lib/database';
import { logout } from '@/app/auth/actions';
import type { User } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { ClientOnly } from '@/components/layout/client-only';


function SettingsPageInternal({ initialUser, t }: { initialUser: User | null, t: any }) {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
  const [name, setName] = useState(initialUser?.name || '');
  const [headline, setHeadline] = useState(initialUser?.headline || '');
  const [bio, setBio] = useState(initialUser?.bio || '');

  const handleLogout = async () => {
    await logout();
    router.push('/logout');
  };

  const handleProfileSave = async () => {
    if (!currentUser) return;
    const result = await updateUserProfile(currentUser.id, { name, headline, bio });
    if (result.success) {
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t.settings}</h1>
        <p className="mt-1 text-muted-foreground">
          {t.manageAccount}
        </p>
      </header>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.profile}</CardTitle>
            <CardDescription>{t.updateProfile}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t.name}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">{t.headline}</Label>
                <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">{t.bio}</Label>
                <Textarea id="bio" className="w-full min-h-24 p-2 border rounded-md" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
             <Button onClick={handleProfileSave}>{t.saveChanges}</Button>
          </CardContent>
        </Card>
        
        <Separator />

        <Card>
            <CardHeader>
                <CardTitle>{t.verification}</CardTitle>
                <CardDescription>{t.verifyWork}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert>
                    <Briefcase className="h-4 w-4" />
                    <AlertTitle>{t.currentPosition}</AlertTitle>
                    <AlertDescription>
                        <p className="font-semibold">{currentUser.jobTitle} at {currentUser.company}</p>
                        <p className="text-sm text-muted-foreground">{t.positionVerified}</p>
                    </AlertDescription>
                </Alert>
                <div className="space-y-2">
                    <Label htmlFor="work-email">{t.verifyNewEmail}</Label>
                    <div className="flex gap-2">
                        <Input id="work-email" type="email" placeholder="you@company.com" />
                        <Button variant="outline">{t.sendVerification}</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Separator />
        
        <Card>
          <CardHeader>
            <CardTitle>{t.account}</CardTitle>
            <CardDescription>{t.manageAccountSettings}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input id="email" type="email" value={currentUser.email || ''} disabled />
              </div>
              <Button variant="outline">{t.changePassword}</Button>

              <div className="space-y-4 rounded-lg border p-4">
                  <h4 className="font-medium">{t.displayPreferences}</h4>
                  <div className="flex items-center justify-between">
                      <Label htmlFor="show-job-info" className="flex flex-col gap-1">
                          <span>{t.showPositionOnPosts}</span>
                          <span className="font-normal text-muted-foreground text-xs">{t.showPositionDesc}</span>
                      </Label>
                      <Switch id="show-job-info" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                     <Label htmlFor="appearance" className="flex flex-col gap-1">
                          <span>{t.appearance}</span>
                          <span className="font-normal text-muted-foreground text-xs">{t.appearanceDesc}</span>
                      </Label>
                      <ThemeSwitcher />
                  </div>
              </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t.logout}
            </Button>
          </CardFooter>
        </Card>
        
        <Separator />
        
        <Card>
            <CardHeader>
                <CardTitle>{t.langAndRegion}</CardTitle>
                <CardDescription>{t.langAndRegionDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="language">{t.language}</Label>
                     <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                        <SelectTrigger id="language">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                           {availableLanguages.map(lang => (
                               <SelectItem key={lang} value={lang}>{lang.toUpperCase()}</SelectItem>
                           ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">{t.languageDesc}</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button>{t.saveLanguage}</Button>
            </CardFooter>
        </Card>


      </div>
    </div>
  );
}


export default async function SettingsPage() {
    const user = await getCurrentUser();
    const t = await import(`@/lib/locales/en.json`); // Assuming you might want to fetch based on user preference later

    return (
        <ClientOnly>
            <SettingsPageInternal initialUser={user} t={t.default} />
        </ClientOnly>
    );
}
