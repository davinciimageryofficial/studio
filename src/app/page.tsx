
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { ClientOnly } from "@/components/layout/client-only";

export default function WaitlistPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    
    if (email) {
      console.log("Waitlist submission:", email);
      toast({
        title: "You're on the list!",
        description: "Thanks for joining the Sentry waitlist. We'll be in touch soon.",
      });
      e.currentTarget.reset();
    }
  };


  return (
    <ClientOnly>
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
            <div className="grid lg:grid-cols-2">
                <div className="flex flex-col justify-center p-8 sm:p-12">
                    <svg className="size-10 mb-4 text-primary" fill="currentColor" viewBox="0 0 256 256"><path d="M152,24a80,80,0,1,0,59.4,136H152V88a8,8,0,0,0,-16,0v72H68.6a80,80,0,1,0,83.4-136ZM128,200a64,64,0,1,1,64-64A64.07,64.07,0,0,1,128,200Z"></path></svg>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">The Future of Collaboration is Here</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Sentry is an AI-powered platform for top-tier freelancers and creative professionals to connect, collaborate, and build their dream teams.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md items-center gap-2">
                        <Input name="email" type="email" placeholder="Enter your email" required className="h-12 flex-1 text-base" />
                        <Button type="submit" size="lg" className="h-12">
                            Join Waitlist
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </form>
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
                <div className="relative hidden aspect-square lg:block">
                    <Image 
                        src="https://picsum.photos/seed/waitlist/1000/1000"
                        alt="Abstract representation of a professional network"
                        fill
                        className="object-cover"
                        data-ai-hint="futuristic abstract"
                    />
                </div>
            </div>
        </div>
        </div>
    </ClientOnly>
  );
}
