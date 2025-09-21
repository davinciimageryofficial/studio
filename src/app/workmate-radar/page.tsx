
import { WorkmateRadarForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnly } from "@/components/layout/client-only";
import { getCurrentUser } from "@/lib/database";

export default async function WorkmateRadarPage() {
  const currentUser = await getCurrentUser();
  const isLoggedIn = !!currentUser;

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8">
        {/* New Quantum Grid Animation */}
        <div className="relative flex h-96 w-96 items-center justify-center">
          <div className="absolute inset-0 animate-grid-pulse rounded-full bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,white)]"></div>
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            {/* Static Grid */}
            <circle cx="50" cy="50" r="50" className="stroke-primary/10" strokeWidth="0.25"></circle>
            <circle cx="50" cy="50" r="40" className="stroke-primary/10" strokeWidth="0.25"></circle>
            <circle cx="50" cy="50" r="30" className="stroke-primary/10" strokeWidth="0.25"></circle>
            <line x1="50" y1="0" x2="50" y2="100" className="stroke-primary/10" strokeWidth="0.25"></line>
            <line x1="0" y1="50" x2="100" y2="50" className="stroke-primary/10" strokeWidth="0.25"></line>
            <line x1="14.6" y1="14.6" x2="85.4" y2="85.4" className="stroke-primary/10" strokeWidth="0.25"></line>
            <line x1="14.6" y1="85.4" x2="85.4" y2="14.6" className="stroke-primary/10" strokeWidth="0.25"></line>

            {/* Center Pulse */}
            <circle cx="50" cy="50" r="2" className="animate-pulse fill-primary/80"></circle>
            
            {/* Animating Data Packets */}
            <g className="animate-[spin_20s_linear_infinite]">
              <path id="path1" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"></path>
              <rect width="1.5" height="1.5" className="fill-primary animate-[packet-stream_5s_linear_infinite]">
                <animateMotion dur="5s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#path1" />
                </animateMotion>
              </rect>
            </g>
             <g className="animate-[spin_30s_linear_infinite_reverse]">
              <path id="path2" d="M 50,50 m -30,0 a 30,30 0 1_1 60,0 a 30,30 0 1_1 -60,0"></path>
              <rect width="1" height="1" className="fill-primary/80 animate-[packet-stream_8s_linear_infinite]">
                 <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#path2" />
                </animateMotion>
              </rect>
            </g>
            <g className="animate-[spin_15s_linear_infinite]">
                <line id="path3" x1="50" y1="2" x2="50" y2="48" />
                 <rect width="1" height="1" className="fill-primary animate-[packet-stream_3s_linear_infinite]">
                    <animateMotion dur="3s" repeatCount="indefinite">
                        <mpath href="#path3" />
                    </animateMotion>
                </rect>
            </g>
          </svg>
        </div>
          
      <header className="relative w-full text-center py-8">
        {/* Page Title */}
        <div className="relative">
            <h1 className="text-4xl font-headline-tech font-bold tracking-tight sm:text-5xl">AI Workmate Radar</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Let our AI help you build your dream team. Describe your ideal workmate and we'll find the best matches.
            </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl w-full">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader>
            <CardTitle>Find Your Team</CardTitle>
            <CardDescription>Fill out the form below to get AI-powered suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ClientOnly>
              <WorkmateRadarForm isLoggedIn={isLoggedIn} />
            </ClientOnly>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
