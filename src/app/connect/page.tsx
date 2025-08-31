
"use client";

import { useState } from "react";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Heart, X, Sparkles, User, Info, Dna, Lightbulb } from "lucide-react";
import { makeConnectionDecision } from "@/ai/flows/connection-matchmaker";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";


export default function ConnectPage() {
  const [profiles] = useState(placeholderUsers.filter(u => u.id !== '2').slice(0, 7));
  const [activeProfile, setActiveProfile] = useState<(typeof placeholderUsers)[0] | null>(null);
  const [dismissedProfiles, setDismissedProfiles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleProfileClick = (user: (typeof placeholderUsers)[0]) => {
    setActiveProfile(user);
  };

  const handleDecision = async (decision: "connect" | "pass") => {
    if (!activeProfile) return;

    if (decision === 'connect') {
      const currentUser = placeholderUsers[1];
      try {
        const result = await makeConnectionDecision({
          currentUser: { id: currentUser.id, headline: currentUser.headline, skills: currentUser.skills, bio: currentUser.bio },
          otherUser: { id: activeProfile.id, headline: activeProfile.headline, skills: activeProfile.skills, bio: activeProfile.bio },
        });

        if (result.match) {
          toast({
            title: "It's a Match!",
            description: (
              <div>
                <p>You and {activeProfile.name} have connected.</p>
                <p className="font-semibold text-sm mt-2">Reason: {result.reason}</p>
              </div>
            ),
            action: (
              <div className="flex items-center text-yellow-400">
                <Sparkles className="mr-2 h-5 w-5" />
                <span className="font-bold">AI Recommended</span>
              </div>
            )
          });
        } else {
            toast({
              variant: "default",
              title: "Connection Sent",
              description: `Your connection request has been sent to ${activeProfile.name}.`,
            });
        }
      } catch (error) {
        console.error("Failed to make connection decision:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem connecting. Please try again.",
        });
      }
    }
    
    setDismissedProfiles(prev => [...prev, activeProfile.id]);
    setActiveProfile(null);
  };
  
  const availableProfiles = profiles.filter(p => !dismissedProfiles.includes(p.id));

  return (
    <div className="flex h-full flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Connection Radar</h1>
            <p className="mt-1 text-muted-foreground">
            Explore your professional orbit. Click a profile to learn more.
            </p>
        </div>

        <div className="relative flex h-96 w-96 items-center justify-center md:h-[32rem] md:w-[32rem]">
            {/* Radar Rings */}
            <div className="absolute h-full w-full rounded-full border-2 border-dashed border-border animate-spin-slow" />
            <div className="absolute h-2/3 w-2/3 rounded-full border-2 border-dashed border-border animate-spin-medium" />
            <div className="absolute h-1/3 w-1/3 rounded-full border border-dashed border-border" />

            {/* Central User */}
            <div className="relative z-10">
                <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={placeholderUsers[1].avatar} />
                    <AvatarFallback>ME</AvatarFallback>
                </Avatar>
            </div>

            {/* Orbiting Profiles */}
            {availableProfiles.map((user, index) => {
              const angle = (index / availableProfiles.length) * 2 * Math.PI;
              const radius = index % 2 === 0 ? '48%' : '32%';
              const style = {
                transform: `rotate(${angle}rad) translate(${radius}) rotate(-${angle}rad)`,
                animation: `orbit ${15 + index * 2}s linear infinite`,
              };
              return (
                <div key={user.id} className="absolute top-1/2 left-1/2" style={style}>
                    <button onClick={() => handleProfileClick(user)} className="group relative">
                        <Avatar className="h-14 w-14 border-2 border-primary/50 transition-all duration-300 group-hover:scale-110">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {user.name}
                        </span>
                    </button>
                </div>
              );
            })}
        </div>

      <Dialog open={!!activeProfile} onOpenChange={(isOpen) => !isOpen && setActiveProfile(null)}>
        <DialogContent className="max-w-md">
            {activeProfile && (
                <>
                    <DialogHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={activeProfile.avatar} alt={activeProfile.name} />
                            <AvatarFallback className="text-3xl">{activeProfile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <DialogTitle className="text-2xl">{activeProfile.name}</DialogTitle>
                        <DialogDescription>{activeProfile.headline}</DialogDescription>
                    </DialogHeader>
                    <div className="my-4 space-y-4 px-4 text-sm">
                        <div className="flex items-start gap-3">
                            <Info className="h-4 w-4 mt-1 text-muted-foreground" />
                            <p className="text-muted-foreground">{activeProfile.bio}</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Dna className="h-4 w-4 mt-1 text-muted-foreground" />
                             <div className="flex flex-wrap gap-1">
                                {activeProfile.skills.slice(0,5).map(skill => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex-row justify-center gap-4">
                         <Button
                          variant="outline"
                          size="icon"
                          className="h-16 w-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDecision('pass')}
                        >
                          <X className="h-8 w-8" />
                          <span className="sr-only">Pass</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-16 w-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                          onClick={() => handleDecision('connect')}
                        >
                          <Heart className="h-8 w-8" />
                          <span className="sr-only">Connect</span>
                        </Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
