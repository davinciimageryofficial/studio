
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
                 <svg className="size-7 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8H4C4 4 8 4 8 8ZM8 8V12C8 16 4 16 4 12H8ZM8 8H12C16 8 16 4 12 4V8H8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 16H20C20 20 16 20 16 16ZM16 16V12C16 8 20 8 20 12H16ZM16 16H12C8 16 8 20 12 20V16H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
