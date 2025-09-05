
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
                    <svg className="size-10 mb-4 text-primary" viewBox="0 0 256 256" fill="currentColor">
                        <path d="M208,32H48A16,16,0,0,0,32,48V160a16,16,0,0,0,16,16H80v32a16,16,0,0,0,24.4,14.5l40-24A15.9,15.9,0,0,0,152,184V176h24a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,128H176V128a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v32H48V48H208Zm-48-48a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h40A8,8,0,0,1,160,112Z"/>
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
                    <svg className="size-48 text-muted-foreground/40" viewBox="0 0 256 256" fill="currentColor">
                        <path d="M208,32H48A16,16,0,0,0,32,48V160a16,16,0,0,0,16,16H80v32a16,16,0,0,0,24.4,14.5l40-24A15.9,15.9,0,0,0,152,184V176h24a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,128H176V128a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v32H48V48H208Zm-48-48a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h40A8,8,0,0,1,160,112Z"/>
                    </svg>
                </div>
            </div>
        </div>
        </div>
    </ClientOnly>
  );
}
