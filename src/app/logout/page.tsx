
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, BrainCircuit, Mic, Newspaper } from "lucide-react";
import Link from "next/link";

export default function LogoutPage() {

  const features = [
    {
      icon: <BrainCircuit className="h-5 w-5 text-primary" />,
      title: "AI Matchmaking",
    },
    {
      icon: <Mic className="h-5 w-5 text-primary" />,
      title: "Focus Workspaces",
    },
    {
      icon: <Newspaper className="h-5 w-5 text-primary" />,
      title: "Exclusive Content",
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg text-center shadow-2xl">
        <CardHeader className="p-8 sm:p-12">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                 <svg className="size-7 text-primary" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
                </svg>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tighter">You're Logged Out</CardTitle>
            <CardDescription className="mt-2 text-lg text-muted-foreground">
                Your next opportunity is just a click away.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
             <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="w-full" size="lg">
                    <Link href="/dashboard">Log Back In <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="lg">
                    <Link href="/">Create an Account</Link>
                </Button>
            </div>
            <Separator className="my-8" />
             <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">Don't miss out on:</p>
                <div className="flex justify-center gap-6 sm:gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex items-center gap-2 text-sm">
                            {feature.icon}
                            <span className="font-medium">{feature.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
