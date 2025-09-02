
import { WorkmateRadarForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnly } from "@/components/layout/client-only";

export default function WorkmateRadarPage() {
  return (
    <div>
      <header className="relative flex min-h-screen flex-col items-center justify-center gap-12 overflow-hidden bg-background p-4">
        {/* New Orbital Animation */}
        <div className="relative flex h-80 w-80 items-center justify-center">
            {/* Center */}
            <div className="absolute grid h-24 w-24 place-content-center rounded-full bg-primary/5 text-primary">
                <div className="h-12 w-12 rounded-full bg-primary/10"></div>
            </div>

            {/* Orbiting Dots */}
            <div className="absolute h-full w-full animate-[spin-slow_20s_linear_infinite]">
                <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-primary"></div>
            </div>
            <div className="absolute h-full w-full animate-[spin-medium_15s_linear_infinite]">
                 <div className="absolute right-1/2 top-full h-3 w-3 -translate-y-1/2 rounded-full bg-primary/80"></div>
            </div>
            <div className="absolute h-2/3 w-2/3 animate-[spin-medium_10s_linear_infinite]">
                 <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary/60"></div>
            </div>
             <div className="absolute h-1/2 w-1/2 animate-[spin-slow_8s_linear_infinite]">
                 <div className="absolute right-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-primary/40"></div>
            </div>
        </div>
          
        {/* Page Title */}
        <div className="relative text-center">
            <h1 className="text-4xl font-headline-tech font-bold tracking-tight sm:text-5xl">AI Workmate Radar</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                Let our AI help you build your dream team. Describe your ideal workmate and we&apos;ll find the best matches.
            </p>
        </div>
      </header>

      <div className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle>Find Your Team</CardTitle>
              <CardDescription>Fill out the form below to get AI-powered suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientOnly>
                <WorkmateRadarForm />
              </ClientOnly>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
