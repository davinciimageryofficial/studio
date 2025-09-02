
import { WorkmateRadarForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnly } from "@/components/layout/client-only";

export default function WorkmateRadarPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
            <div className="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center">
                {/* Radar Pings */}
                <div className="absolute h-full w-full rounded-full bg-primary/10 animate-ping"></div>
                <div className="absolute h-2/3 w-2/3 rounded-full bg-primary/10 animate-ping [animation-delay:0.5s]"></div>
                
                {/* Radar Static Rings */}
                <div className="absolute h-full w-full rounded-full border-2 border-dashed border-primary/20"></div>
                <div className="absolute h-2/3 w-2/3 rounded-full border-2 border-dashed border-primary/20"></div>
                
                {/* Radar Scanner */}
                <div className="absolute h-full w-full animate-spin-slow [animation-duration:5s]">
                    <div className="absolute top-0 left-1/2 h-1/2 w-px bg-gradient-to-b from-primary/50 to-transparent"></div>
                </div>

                {/* Center Dot */}
                <div className="h-4 w-4 rounded-full bg-primary shadow-lg"></div>
            </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Workmate Radar</h1>
          <p className="mt-2 text-muted-foreground">
            Let our AI help you build your dream team. Describe your ideal
            workmate and we&apos;ll find the best matches.
          </p>
        </header>

        <Card>
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
  );
}
