
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
                        <path d="M152.3,26.1,128,14,103.7,26.1a16,16,0,0,0-8.2,14.3V61.8H48a16,16,0,0,0-16,16V178.2a16,16,0,0,0,16,16H95.5V215.6a16,16,0,0,0,8.2,14.3L128,242l24.3-12.1a16,16,0,0,0,8.2-14.3V194.2H208a16,16,0,0,0,16-16V77.8a16,16,0,0,0-16-16H160.5V40.4A16,16,0,0,0,152.3,26.1ZM144.5,194.2V215.6l-16.5,8.3-16.5-8.3V194.2h33Zm-49-16.4V61.8h57v16H112a16,16,0,0,0-16,16v84.4Zm102.6-16H112V93.8h87.1V177.8ZM208,77.8v.1H95.5V77.8H208ZM144.5,61.8V40.4l-16.5-8.2-16.5,8.2V61.8Z"/>
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
                        <path d="M152.3,26.1,128,14,103.7,26.1a16,16,0,0,0-8.2,14.3V61.8H48a16,16,0,0,0-16,16V178.2a16,16,0,0,0,16,16H95.5V215.6a16,16,0,0,0,8.2,14.3L128,242l24.3-12.1a16,16,0,0,0,8.2-14.3V194.2H208a16,16,0,0,0,16-16V77.8a16,16,0,0,0-16-16H160.5V40.4A16,16,0,0,0,152.3,26.1ZM144.5,194.2V215.6l-16.5,8.3-16.5-8.3V194.2h33Zm-49-16.4V61.8h57v16H112a16,16,0,0,0-16,16v84.4Zm102.6-16H112V93.8h87.1V177.8ZM208,77.8v.1H95.5V77.8H208ZM144.5,61.8V40.4l-16.5-8.2-16.5,8.2V61.8Z"/>
                    </svg>
                </div>
            </div>
        </div>
        </div>
    </ClientOnly>
  );
}
