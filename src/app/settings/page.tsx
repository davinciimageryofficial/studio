
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
                            <SelectItem value="zh">中文 (Chinese)</SelectItem>
                            <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                            <SelectItem value="es">Español (Spanish)</SelectItem>
                            <SelectItem value="fr">Français (French)</SelectItem>
                            <SelectItem value="ar">العربية (Arabic)</SelectItem>
                            <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                            <SelectItem value="ru">Русский (Russian)</SelectItem>
                            <SelectItem value="pt">Português (Portuguese)</SelectItem>
                            <SelectItem value="ur">اردو (Urdu)</SelectItem>
                            <SelectItem value="id">Bahasa Indonesia</SelectItem>
                            <SelectItem value="de">Deutsch (German)</SelectItem>
                            <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                            <SelectItem value="pcm">Nigerian Pidgin</SelectItem>
                            <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                            <SelectItem value="tr">Türkçe (Turkish)</SelectItem>
                            <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                            <SelectItem value="vi">Tiếng Việt (Vietnamese)</SelectItem>
                            <SelectItem value="ko">한국어 (Korean)</SelectItem>
                            <SelectItem value="jv">Basa Jawa (Javanese)</SelectItem>
                            <SelectItem value="it">Italiano (Italian)</SelectItem>
                            <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                            <SelectItem value="pl">Polski (Polish)</SelectItem>
                            <SelectItem value="uk">Українська (Ukrainian)</SelectItem>
                            <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                            <SelectItem value="nl">Nederlands (Dutch)</SelectItem>
                            <SelectItem value="yo">Yorùbá (Yoruba)</SelectItem>
                            <SelectItem value="ms">Bahasa Melayu (Malay)</SelectItem>
                            <SelectItem value="th">ไทย (Thai)</SelectItem>
                            <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                            <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                            <SelectItem value="ig">Igbo</SelectItem>
                            <SelectItem value="ha">Hausa</SelectItem>
                            <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
                            <SelectItem value="my">မြန်မာ (Burmese)</SelectItem>
                            <SelectItem value="su">Basa Sunda</SelectItem>
                            <SelectItem value="ro">Română (Romanian)</SelectItem>
                            <SelectItem value="uz">Oʻzbekcha (Uzbek)</SelectItem>
                            <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                            <SelectItem value="fa">فارسی (Persian)</SelectItem>
                            <SelectItem value="bho">Bhojpuri</SelectItem>
                            <SelectItem value="so">Soomaaliga (Somali)</SelectItem>
                            <SelectItem value="fil">Filipino</SelectItem>
                            <SelectItem value="ps">پښتو (Pashto)</SelectItem>
                            <SelectItem value="el">Ελληνικά (Greek)</SelectItem>
                            <SelectItem value="sv">Svenska (Swedish)</SelectItem>
                            <SelectItem value="hu">Magyar (Hungarian)</SelectItem>
                            <SelectItem value="cs">Čeština (Czech)</SelectItem>
                            <SelectItem value="az">Azərbaycanca (Azerbaijani)</SelectItem>
                            <SelectItem value="he">עברית (Hebrew)</SelectItem>
                            <SelectItem value="ceb">Cebuano</SelectItem>
                            <SelectItem value="mg">Malagasy</SelectItem>
                            <SelectItem value="bg">Български (Bulgarian)</SelectItem>
                            <SelectItem value="be">Беларуская (Belarusian)</SelectItem>
                            <SelectItem value="si">සිංහල (Sinhala)</SelectItem>
                            <SelectItem value="tt">Tatar</SelectItem>
                            <SelectItem value="no">Norsk (Norwegian)</SelectItem>
                            <SelectItem value="sk">Slovenčina (Slovak)</SelectItem>
                            <SelectItem value="da">Dansk (Danish)</SelectItem>
                            <SelectItem value="fi">Suomi (Finnish)</SelectItem>
                            <SelectItem value="hr">Hrvatski (Croatian)</SelectItem>
                            <SelectItem value="lt">Lietuvių (Lithuanian)</SelectItem>
                            <SelectItem value="sl">Slovenščina (Slovenian)</SelectItem>
                            <SelectItem value="et">Eesti (Estonian)</SelectItem>
                            <SelectItem value="lv">Latviešu (Latvian)</SelectItem>
                            <SelectItem value="ga">Gaeilge (Irish)</SelectItem>
                            <SelectItem value="mt">Malti (Maltese)</SelectItem>
                            <SelectItem value="is">Íslenska (Icelandic)</SelectItem>
                            <SelectItem value="cy">Cymraeg (Welsh)</SelectItem>
                            <SelectItem value="eu">Euskara (Basque)</SelectItem>
                            <SelectItem value="ca">Català (Catalan)</SelectItem>
                            <SelectItem value="gl">Galego (Galician)</SelectItem>
                            <SelectItem value="af">Afrikaans</SelectItem>
                            <SelectItem value="sw">Kiswahili</SelectItem>
                            <SelectItem value="zu">IsiZulu</SelectItem>
                            <SelectItem value="xh">IsiXhosa</SelectItem>
                            <SelectItem value="st">Sesotho</SelectItem>
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
