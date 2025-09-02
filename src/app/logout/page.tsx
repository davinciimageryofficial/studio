
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BrainCircuit, Briefcase, Mic, Newspaper, Rocket } from "lucide-react";
import Link from "next/link";

export default function LogoutPage() {

  const features = [
    {
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
      title: "AI Workmate Radar",
      description: "Discover your next collaborator with intelligent, profile-based matchmaking."
    },
    {
      icon: <Mic className="h-6 w-6 text-primary" />,
      title: "Collaborative Workspaces",
      description: "Enter a flow state with team or solo sessions designed for deep work."
    },
    {
      icon: <Newspaper className="h-6 w-6 text-primary" />,
      title: "Exclusive Content",
      description: "Stay ahead with curated news, courses, and insights from industry leaders."
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-4xl">
        <Card className="w-full shadow-2xl">
          <CardContent className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-12">
                <svg className="size-10 mb-4 text-primary" fill="currentColor" viewBox="0 0 256 256"><path d="M152,24a80,80,0,1,0,59.4,136H152V88a8,8,0,0,0,-16,0v72H68.6a80,80,0,1,0,83.4-136ZM128,200a64,64,0,1,1,64-64A64.07,64.07,0,0,1,128,200Z"></path></svg>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Your Next Opportunity Awaits</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    You've successfully logged out. But your dream team and next big project are still here, waiting for you.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Button asChild className="w-full sm:w-auto" size="lg">
                        <Link href="/dashboard">Log Back In <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                     <Button asChild variant="outline" className="w-full sm:w-auto" size="lg">
                        <Link href="/">Create an Account</Link>
                    </Button>
                </div>
            </div>
             <div className="hidden md:flex flex-col justify-center bg-muted/50 p-12">
               <h3 className="text-xl font-semibold mb-6">Why Sentry is Different</h3>
               <div className="space-y-6">
                {features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                            {feature.icon}
                        </div>
                        <div>
                            <h4 className="font-semibold">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    </div>
                ))}
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
