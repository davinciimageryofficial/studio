
import { WorkmateRadarForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnly } from "@/components/layout/client-only";

export default function WorkmateRadarPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
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
