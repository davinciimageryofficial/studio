
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ClientOnly } from "@/components/layout/client-only";
import { Kanban, Languages } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  userType: z.enum(["business", "freelancer"], {
    errorMap: () => ({ message: "Please select an option." }),
  }),
  profession: z.enum(["design", "development", "writing", "marketing", "business", "other"], {
    errorMap: () => ({ message: "Please select your primary work category." }),
  }),
  niche: z.string().min(2, "Please specify your niche or role."),
  earlyAccess: z.boolean().default(false),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      niche: "",
      earlyAccess: false,
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
    console.log("Signup submission:", data);

    // Store data in localStorage to pass to the confirmation page
    localStorage.setItem("waitlistData", JSON.stringify(data));
    
    toast({
      title: t.signupSuccessToastTitle,
      description: t.signupSuccessToastDesc,
    });

    router.push('/waitlist-confirmation');
  };

  return (
    <ClientOnly>
      <div className="w-full bg-background">
         <div className="absolute top-6 right-6 z-10">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="icon">
                        <Languages className="h-5 w-5" />
                        <span className="sr-only">Change language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setLanguage('en')}>English</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('zh')}>中文 (Chinese)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('hi')}>हिन्दी (Hindi)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('es')}>Español (Spanish)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('fr')}>Français (French)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ar')}>العربية (Arabic)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('bn')}>বাংলা (Bengali)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ru')}>Русский (Russian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('pt')}>Português (Portuguese)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ur')}>اردو (Urdu)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('id')}>Bahasa Indonesia</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('de')}>Deutsch (German)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ja')}>日本語 (Japanese)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('pcm')}>Nigerian Pidgin</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('mr')}>मराठी (Marathi)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('te')}>తెలుగు (Telugu)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('tr')}>Türkçe (Turkish)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ta')}>தமிழ் (Tamil)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('vi')}>Tiếng Việt (Vietnamese)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ko')}>한국어 (Korean)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('jv')}>Basa Jawa (Javanese)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('it')}>Italiano (Italian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('gu')}>ગુજરાતી (Gujarati)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('pl')}>Polski (Polish)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('uk')}>Українська (Ukrainian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('pa')}>ਪੰਜਾਬੀ (Punjabi)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('nl')}>Nederlands (Dutch)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('yo')}>Yorùbá (Yoruba)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ms')}>Bahasa Melayu (Malay)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('th')}>ไทย (Thai)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('kn')}>ಕನ್ನಡ (Kannada)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ml')}>മലയാളം (Malayalam)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ig')}>Igbo</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ha')}>Hausa</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('or')}>ଓଡ଼ିଆ (Odia)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('my')}>မြန်မာ (Burmese)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('su')}>Basa Sunda</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ro')}>Română (Romanian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('uz')}>Oʻzbekcha (Uzbek)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('am')}>አማርኛ (Amharic)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('fa')}>فارسی (Persian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('bho')}>Bhojpuri</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('so')}>Soomaaliga (Somali)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('fil')}>Filipino</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ps')}>پښتو (Pashto)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('el')}>Ελληνικά (Greek)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('sv')}>Svenska (Swedish)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('hu')}>Magyar (Hungarian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('cs')}>Čeština (Czech)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('az')}>Azərbaycanca (Azerbaijani)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('he')}>עברית (Hebrew)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ceb')}>Cebuano</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('mg')}>Malagasy</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('bg')}>Български (Bulgarian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('be')}>Беларуская (Belarusian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('si')}>සිංහල (Sinhala)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('tt')}>Tatar</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('no')}>Norsk (Norwegian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('sk')}>Slovenčina (Slovak)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('da')}>Dansk (Danish)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('fi')}>Suomi (Finnish)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('hr')}>Hrvatski (Croatian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('lt')}>Lietuvių (Lithuanian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('sl')}>Slovenščina (Slovenian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('et')}>Eesti (Estonian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('lv')}>Latviešu (Latvian)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ga')}>Gaeilge (Irish)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('mt')}>Malti (Maltese)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('is')}>Íslenska (Icelandic)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('cy')}>Cymraeg (Welsh)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('eu')}>Euskara (Basque)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ca')}>Català (Catalan)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('gl')}>Galego (Galician)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('af')}>Afrikaans</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('sw')}>Kiswahili</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('zu')}>IsiZulu</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('xh')}>IsiXhosa</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('st')}>Sesotho</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('sn')}>ChiShona</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="grid min-h-screen lg:grid-cols-2">
          <div className="flex items-center justify-center p-8 sm:p-12">
            <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
              <CardHeader className="text-center p-0 mb-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <Kanban className="size-7 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold tracking-tighter">{t.signupTitle}</CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">
                  {t.signupDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                      control={control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.signupFullName}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t.signupFullNamePlaceholder} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.signupEmail}</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} placeholder={t.signupEmailPlaceholder} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.signupUserCategory}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t.signupUserCategoryPlaceholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="business">{t.signupUserCategoryBusiness}</SelectItem>
                              <SelectItem value="freelancer">{t.signupUserCategoryFreelancer}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.signupProfession}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t.signupProfessionPlaceholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="design">{t.signupProfessionDesign}</SelectItem>
                              <SelectItem value="development">{t.signupProfessionDev}</SelectItem>
                              <SelectItem value="writing">{t.signupProfessionWriting}</SelectItem>
                              <SelectItem value="marketing">{t.signupProfessionMarketing}</SelectItem>
                              <SelectItem value="business">{t.signupProfessionBusiness}</SelectItem>
                              <SelectItem value="other">{t.signupProfessionOther}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={control}
                      name="niche"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.signupNiche}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t.signupNichePlaceholder} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="earlyAccess"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              {t.signupEarlyAccess}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" size="lg">{t.joinWaitlist}</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="relative hidden lg:flex items-center justify-center bg-muted/20 p-8">
              <Kanban className="size-48 text-muted-foreground/40" />
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
