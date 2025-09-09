
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, BrainCircuit, Kanban, Mic, Newspaper } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-end bg-background p-4">
       <div className="flex flex-col items-end justify-center p-8 sm:p-12 text-right max-w-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                 <Kanban className="size-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter">You're Logged Out</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Your next opportunity is just a click away.
            </p>
             <div className="mt-8 flex w-full max-w-sm flex-col sm:flex-row gap-4">
                <Button asChild className="w-full" size="lg">
                    <Link href="/dashboard">Log Back In <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="lg">
                    <Link href="/">Create an Account</Link>
                </Button>
            </div>
            <Separator className="my-8 max-w-sm" />
             <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">Don't miss out on:</p>
                <div className="flex justify-end gap-6 sm:gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex items-center gap-2 text-sm">
                            {feature.icon}
                            <span className="font-medium">{feature.title}</span>
                        </div>
                    ))}
                </div>
            </div>
       </div>
    </div>
  );
}
