
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
                    <svg className="size-10 mb-4 text-primary" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" opacity="0.2"></path>
                        <path d="M152.2,60.2a52,52,0,0,0-73.5,73.5l-2.3,2.3a12,12,0,0,0,0,17,12,12,0,0,0,17,0l2.3-2.3a52,52,0,0,0,73.5-73.5l2.3-2.3a12,12,0,0,0-17-17ZM135.2,149a28,28,0,0,1-39.6-39.6l19.8-19.8a28,28,0,0,1,39.6,39.6Z"></path>
                        <path d="M103.8,195.8a52,52,0,0,0,73.5-73.5l2.3-2.3a12,12,0,0,0-17-17l-2.3,2.3a52,52,0,0,0-73.5,73.5l-2.3,2.3a12,12,0,1,0,17,17Z" opacity="0.2"></path>
                        <path d="M198,34s-4,6-8,8-10,0-10,0l-2,4a80.14,80.14,0,0,0-28,16l-4-2s-6-4-8-2-4,10-4,10l-4,2a80.14,80.14,0,0,0-16,28l-2,4s-4-4-10-4-8,2-8,2l-4,2a80.14,80.14,0,0,0-16,28l-2,4s-6-4-8-2-4,10-4,10l-2,4a80.14,80.14,0,0,0,16,28l4,2s4,6,2,8,10,4,10,4l4-2a80.14,80.14,0,0,0,28-16l2-4s4,4,10,4,8-2,8-2l4-2a80.14,80.14,0,0,0,28-16l2-4s4-4,8-2,4,10,4,10l2-4a80.14,80.14,0,0,0,16-28l2-4s-4-6-2-8-10-4-10-4l-4,2a80.14,80.14,0,0,0-28,16l-2,4s-4,4-8,2-4-10-4-10l-2-4a80.14,80.14,0,0,0-16-28Z" opacity="0.2"></path>
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
                    <svg className="size-48 text-muted-foreground/40" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" opacity="0.2"></path>
                        <path d="M152.2,60.2a52,52,0,0,0-73.5,73.5l-2.3,2.3a12,12,0,0,0,0,17,12,12,0,0,0,17,0l2.3-2.3a52,52,0,0,0,73.5-73.5l2.3-2.3a12,12,0,0,0-17-17ZM135.2,149a28,28,0,0,1-39.6-39.6l19.8-19.8a28,28,0,0,1,39.6,39.6Z"></path>
                        <path d="M103.8,195.8a52,52,0,0,0,73.5-73.5l2.3-2.3a12,12,0,0,0-17-17l-2.3,2.3a52,52,0,0,0-73.5,73.5l-2.3,2.3a12,12,0,1,0,17,17Z" opacity="0.2"></path>
                        <path d="M198,34s-4,6-8,8-10,0-10,0l-2,4a80.14,80.14,0,0,0-28,16l-4-2s-6-4-8-2-4,10-4,10l-4,2a80.14,80.14,0,0,0-16,28l-2,4s-4-4-10-4-8,2-8,2l-4,2a80.14,80.14,0,0,0-16,28l-2,4s-6-4-8-2-4,10-4,10l-2,4a80.14,80.14,0,0,0,16,28l4,2s4,6,2,8,10,4,10,4l4-2a80.14,80.14,0,0,0,28-16l2-4s4,4,10,4,8-2,8-2l4-2a80.14,80.14,0,0,0,28-16l2-4s4-4,8-2,4,10,4,10l2-4a80.14,80.14,0,0,0,16-28l2-4s-4-6-2-8-10-4-10-4l-4,2a80.14,80.14,0,0,0-28,16l-2,4s-4,4-8,2-4-10-4-10l-2-4a80.14,80.14,0,0,0-16-28Z" opacity="0.2"></path>
                    </svg>
                </div>
            </div>
        </div>
        </div>
    </ClientOnly>
  );
}
