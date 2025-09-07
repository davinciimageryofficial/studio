
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function AdStudioPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
       <header className="mb-8 text-center">
            <Zap className="mx-auto h-12 w-12 mb-4 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight font-headline-tech uppercase">AD-Sentry Studio</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-3xl mx-auto">
                Welcome to the early access preview of the AD-Sentry Studio. More features coming soon!
            </p>
        </header>
        <div className="flex items-center justify-center">
             <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Ad Studio Dashboard</CardTitle>
                    <CardDescription>This is where you'll manage your AI-powered ad campaigns.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-96 flex items-center justify-center text-muted-foreground">
                    <p>Campaign management tools will be available here.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
