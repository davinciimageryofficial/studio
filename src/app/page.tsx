
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Kanban, Languages } from "lucide-react";
import { ClientOnly } from "@/components/layout/client-only";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";

const translations = {
    en: {
        title: "The Future of Collaboration is Here",
        description: "Sentry is an AI-powered platform for businesses, top-tier freelancers and creative professionals to connect, collaborate, and build their dream teams.",
        join: "Join Waitlist",
        faq: "FAQ",
        feature1: "AI-Powered Matchmaking",
        feature2: "Collaborative Workspaces",
        feature3: "Curated Job Board",
    },
    es: {
        title: "El Futuro de la Colaboración está Aquí",
        description: "Sentry es una plataforma impulsada por IA para que empresas, freelancers de primer nivel y profesionales creativos se conecten, colaboren y construyan sus equipos de ensueño.",
        join: "Unirse a la Lista de Espera",
        faq: "Preguntas Frecuentes",
        feature1: "Matchmaking con IA",
        feature2: "Espacios de Trabajo Colaborativos",
        feature3: "Bolsa de Trabajo Curada",
    },
    fr: {
        title: "Le Futur de la Collaboration est Ici",
        description: "Sentry est une plateforme alimentée par l'IA pour les entreprises, les freelances de haut niveau et les professionnels créatifs pour se connecter, collaborer et construire leurs équipes de rêve.",
        join: "Rejoindre la liste d'attente",
        faq: "FAQ",
        feature1: "Matchmaking par IA",
        feature2: "Espaces de travail collaboratifs",
        feature3: "Offres d'emploi sélectionnées",
    },
    de: {
        title: "Die Zukunft der Zusammenarbeit ist da",
        description: "Sentry ist eine KI-gestützte Plattform für Unternehmen, Top-Freelancer und Kreativprofis, um sich zu vernetzen, zusammenzuarbeiten und ihre Traumteams aufzubauen.",
        join: "Auf die Warteliste",
        faq: "FAQ",
        feature1: "KI-gestütztes Matchmaking",
        feature2: "Kollaborative Arbeitsbereiche",
        feature3: "Kuratiertes Jobbörse",
    },
    ja: {
        title: "コラボレーションの未来がここに",
        description: "Sentryは、企業、トップクラスのフリーランサー、クリエイティブプロフェッショナルが繋がり、協力し、夢のチームを構築するためのAI搭載プラットフォームです。",
        join: "ウェイティングリストに参加",
        faq: "よくある質問",
        feature1: "AIによるマッチメイキング",
        feature2: "共同作業スペース",
        feature3: "厳選された求人掲示板",
    },
    zh: {
        title: "协作的未来就在这里",
        description: "Sentry 是一个由人工智能驱动的平台，供企业、顶级自由职业者和创意专业人士连接、协作和建立他们的梦想团队。",
        join: "加入等候名单",
        faq: "常见问题",
        feature1: "人工智能配对",
        feature2: "协作工作区",
        feature3: "精选职位公告板",
    },
    sn: {
        title: "Ramangwana Rekushandira Pamwe Riri Pano",
        description: "Sentry inzvimbo ine simba reAI yemabhizinesi, vashandi vepamusoro-soro uye nyanzvi dzekugadzira kuti vabatane, vashande pamwe chete, uye kuvaka zvikwata zvavo zvezviroto.",
        join: "Pinda paWaitlist",
        faq: "MIBVUNZO",
        feature1: "Kufananidza neAI",
        feature2: "Nzvimbo dzekushandira pamwe",
        feature3: "Bhodhi reMabasa Rakasarudzwa",
    },
};


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
                            <DropdownMenuItem onSelect={() => setLanguage('es')}>Español (Spanish)</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setLanguage('fr')}>Français (French)</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setLanguage('de')}>Deutsch (German)</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setLanguage('ja')}>日本語 (Japanese)</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setLanguage('zh')}>简体中文 (Mandarin)</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setLanguage('sn')}>ChiShona</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
                <div className="grid lg:grid-cols-2 min-h-screen">
                    <div className="flex flex-col justify-center p-8 sm:p-16 lg:p-24">
                        <Kanban className="size-10 mb-4 text-primary" />
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">{t.title}</h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                           {t.description}
                        </p>
                        <div className="mt-8 flex items-center gap-4">
                            <Button asChild size="lg" className="h-12 px-8">
                                <Link href="/signup">
                                    {t.join}
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
