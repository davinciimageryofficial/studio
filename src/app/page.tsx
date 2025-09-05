
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { ClientOnly } from "@/components/layout/client-only";
import Link from "next/link";

export default function LandingPage() {

  return (
    <ClientOnly>
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
            <div className="grid lg:grid-cols-2">
                <div className="flex flex-col justify-center p-8 sm:p-12">
                    <svg className="size-10 mb-4 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 8H4C4 4 8 4 8 8ZM8 8V12C8 16 4 16 4 12H8ZM8 8H12C16 8 16 4 12 4V8H8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 16H20C20 20 16 20 16 16ZM16 16V12C16 8 20 8 20 12H16ZM16 16H12C8 16 8 20 12 20V16H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">The Future of Collaboration is Here</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Sentry is an AI-powered platform for top-tier freelancers and creative professionals to connect, collaborate, and build their dream teams.
                    </p>
                    <div className="mt-8">
                        <Button asChild size="lg" className="h-12">
                            <Link href="/signup">
                                Join Waitlist
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span>AI-Powered Matchmaking</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span>Collaborative Workspaces</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span>Curated Job Board</span>
                        </div>
                    </div>
                </div>
                <div className="relative hidden lg:flex items-center justify-center bg-muted/20 p-8">
                    <svg className="size-48 text-muted-foreground/40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 8H4C4 4 8 4 8 8ZM8 8V12C8 16 4 16 4 12H8ZM8 8H12C16 8 16 4 12 4V8H8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 16H20C20 20 16 20 16 16ZM16 16V12C16 8 20 8 20 12H16ZM16 16H12C8 16 8 20 12 20V16H16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
        </div>
    </ClientOnly>
  );
}
