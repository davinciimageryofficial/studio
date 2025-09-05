
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
                 <svg className="size-7 text-primary" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" opacity="0.2"></path>
                    <path d="M152.2,60.2a52,52,0,0,0-73.5,73.5l-2.3,2.3a12,12,0,0,0,0,17,12,12,0,0,0,17,0l2.3-2.3a52,52,0,0,0,73.5-73.5l2.3-2.3a12,12,0,0,0-17-17ZM135.2,149a28,28,0,0,1-39.6-39.6l19.8-19.8a28,28,0,0,1,39.6,39.6Z"></path>
                    <path d="M103.8,195.8a52,52,0,0,0,73.5-73.5l2.3-2.3a12,12,0,0,0-17-17l-2.3,2.3a52,52,0,0,0-73.5,73.5l-2.3,2.3a12,12,0,1,0,17,17Z" opacity="0.2"></path>
                    <path d="M198,34s-4,6-8,8-10,0-10,0l-2,4a80.14,80.14,0,0,0-28,16l-4-2s-6-4-8-2-4,10-4,10l-4,2a80.14,80.14,0,0,0-16,28l-2,4s-4-4-10-4-8,2-8,2l-4,2a80.14,80.14,0,0,0-16,28l-2,4s-6-4-8-2-4,10-4,10l-2,4a80.14,80.14,0,0,0,16,28l4,2s4,6,2,8,10,4,10,4l4-2a80.14,80.14,0,0,0,28-16l2-4s4,4,10,4,8-2,8-2l4-2a80.14,80.14,0,0,0,28-16l2-4s4-4,8-2,4,10,4,10l2-4a80.14,80.14,0,0,0,16-28l2-4s-4-6-2-8-10-4-10-4l-4,2a80.14,80.14,0,0,0-28,16l-2,4s-4,4-8,2-4-10-4-10l-2-4a80.14,80.14,0,0,0-16-28Z" opacity="0.2"></path>
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
