
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Kanban, Languages } from "lucide-react";
import { ClientOnly } from "@/components/layout/client-only";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";
import { availableLanguages } from "@/context/language-context";


export default function LandingPage() {
    const { language, setLanguage, translations: t } = useLanguage();

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
                            {availableLanguages.map(lang => (
                                <DropdownMenuItem key={lang} onSelect={() => setLanguage(lang)}>
                                    {lang.toUpperCase()}
                                </DropdownMenuItem>
                            ))}
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
