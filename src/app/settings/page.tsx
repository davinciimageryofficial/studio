
'use client';

import { useState } from 'react';
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
import { useLanguage, Language } from '@/context/language-context';
import { translations } from '@/lib/translations';


export default function SettingsPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const handleLogout = () => {
    router.push('/logout');
  };

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
                <Input id="name" defaultValue="Christian Peta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">{t.headline}</Label>
                <Input id="headline" defaultValue="Senior Frontend Developer | React & Next.js Expert" />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">{t.bio}</Label>
                <textarea id="bio" className="w-full min-h-24 p-2 border rounded-md" defaultValue="Building performant and scalable web applications. I love TypeScript and clean code. Always eager to learn new technologies."></textarea>
            </div>
             <Button>{t.saveChanges}</Button>
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
                        <p className="font-semibold">Senior Frontend Developer at Innovate Inc.</p>
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
                <Input id="email" type="email" defaultValue="chris.peta@example.com" disabled />
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
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español (Spanish)</SelectItem>
                            <SelectItem value="fr">Français (French)</SelectItem>
                            <SelectItem value="de">Deutsch (German)</SelectItem>
                            <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                            <SelectItem value="zh">简体中文 (Mandarin)</SelectItem>
                            <SelectItem value="sn">ChiShona</SelectItem>
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
