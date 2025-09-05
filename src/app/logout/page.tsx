
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
                 <svg className="size-7 text-primary" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M152.3,26.1,128,14,103.7,26.1a16,16,0,0,0-8.2,14.3V61.8H48a16,16,0,0,0-16,16V178.2a16,16,0,0,0,16,16H95.5V215.6a16,16,0,0,0,8.2,14.3L128,242l24.3-12.1a16,16,0,0,0,8.2-14.3V194.2H208a16,16,0,0,0,16-16V77.8a16,16,0,0,0-16-16H160.5V40.4A16,16,0,0,0,152.3,26.1ZM144.5,194.2V215.6l-16.5,8.3-16.5-8.3V194.2h33Zm-49-16.4V61.8h57v16H112a16,16,0,0,0-16,16v84.4Zm102.6-16H112V93.8h87.1V177.8ZM208,77.8v.1H95.5V77.8H208ZM144.5,61.8V40.4l-16.5-8.2-16.5,8.2V61.8Z"/>
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
