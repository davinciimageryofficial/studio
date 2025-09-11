
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Kanban, Languages } from "lucide-react";
import { ClientOnly } from "@/components/layout/client-only";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";


export default function LandingPage() {
    const { language, setLanguage } = useLanguage();
    const t = translations[language];

  return (
    <ClientOnly>
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="relative w-full overflow-hidden">
                <nav className="absolute top-0 right-0 p-6 z-10">
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
                </nav>
                <div className="grid lg:grid-cols-2 min-h-screen">
                    <div className="flex flex-col justify-center p-8 sm:p-16 lg:p-24">
                        <Kanban className="size-10 mb-4 text-primary" />
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">{t.landingTitle}</h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                           {t.landingDescription}
                        </p>
                        <div className="mt-8 flex items-center gap-4">
                            <Button asChild size="lg" className="h-12 px-8">
                                <Link href="/signup">
                                    {t.joinWaitlist}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-muted-foreground">
                                <Link href="/faq">
                                    {t.faq}
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>{t.feature1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>{t.feature2}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>{t.feature3}</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative hidden lg:flex items-center justify-center bg-muted/20 p-8">
                        <Kanban className="size-64 text-muted-foreground/20" />
                    </div>
                </div>
            </div>
        </div>
    </ClientOnly>
  );
}
