
import { WorkmateRadarForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnly } from "@/components/layout/client-only";

export default function WorkmateRadarPage() {
  return (
    <div>
      <header className="relative flex h-screen flex-col items-center justify-center overflow-hidden">
          {/* Radar Animation */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex h-80 w-80 items-center justify-center">
                  {/* Radar Pings */}
                  <div className="absolute h-full w-full rounded-full bg-primary/5 animate-ping [animation-duration:3s] [animation-delay:0s]"></div>
                  <div className="absolute h-[calc(100%-40px)] w-[calc(100%-40px)] rounded-full bg-primary/5 animate-ping [animation-duration:3s] [animation-delay:0.5s]"></div>
                  <div className="absolute h-[calc(100%-80px)] w-[calc(100%-80px)] rounded-full bg-primary/5 animate-ping [animation-duration:3s] [animation-delay:1s]"></div>
                  
                  {/* Radar Static Rings */}
                  <div className="absolute h-20 w-20 rounded-full border-2 border-dashed border-primary/20"></div>
                  <div className="absolute h-40 w-40 rounded-full border-2 border-dashed border-primary/20"></div>
                  <div className="absolute h-60 w-60 rounded-full border-2 border-dashed border-primary/20"></div>
                  <div className="absolute h-80 w-80 rounded-full border-2 border-dashed border-primary/20"></div>
                  
                  {/* Center Dot */}
                  <div className="h-4 w-4 rounded-full bg-primary shadow-lg"></div>
              </div>
          </div>
          
          {/* Page Title */}
          <div className="relative text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">AI Workmate Radar</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Let our AI help you build your dream team.
            </p>
             <p className="text-muted-foreground">Describe your ideal workmate and we&apos;ll find the best matches.</p>
          </div>
      </header>

      <div className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl -mt-32">
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
    </div>
  );
}
