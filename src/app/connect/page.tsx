
"use client";

import { useState } from "react";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Heart, X, RotateCcw, Sparkles } from "lucide-react";
import Image from "next/image";
import { makeConnectionDecision } from "@/ai/flows/connection-matchmaker";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function ConnectPage() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toast } = useToast();

  const handleSwipe = async (decision: "connect" | "pass") => {
    if (!api) return;

    const currentUser = placeholderUsers[1]; // Assuming "me" is user 2
    const otherUser = placeholderUsers[api.selectedScrollSnap()];

    if (decision === 'connect') {
        try {
            const result = await makeConnectionDecision({
                currentUser: {
                    id: currentUser.id,
                    headline: currentUser.headline,
                    skills: currentUser.skills,
                    bio: currentUser.bio,
                },
                otherUser: {
                    id: otherUser.id,
                    headline: otherUser.headline,
                    skills: otherUser.skills,
                    bio: otherUser.bio,
                }
            });

            if (result.match) {
                 toast({
                    title: "It's a Match!",
                    description: `You and ${otherUser.name} have connected.`,
                    action: (
                        <div className="flex items-center text-yellow-400">
                           <Sparkles className="mr-2 h-5 w-5" />
                           <span className="font-bold">AI Recommended</span>
                        </div>
                    )
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


    if (api.canScrollNext()) {
      api.scrollNext();
    } else {
      // Loop back to the beginning
      api.scrollTo(0);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Make Connections</h1>
        <p className="mt-1 text-muted-foreground">
          Swipe right to connect, or left to pass.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <Carousel
          className="relative w-full"
          opts={{
            loop: true,
          }}
          setApi={setApi}
        >
          <CarouselContent>
            {placeholderUsers.filter(u => u.id !== '2').map((user, index) => ( // Filter out the current user
              <CarouselItem key={index}>
                <SwipeCard user={user} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
         <div className="mt-8 flex justify-center items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-20 w-20 rounded-full border-2 border-red-500 bg-white text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => handleSwipe('pass')}
            >
              <X className="h-10 w-10" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-full border-2 border-yellow-500 text-yellow-500"
                onClick={() => api?.scrollPrev()}
            >
                <RotateCcw className="h-8 w-8" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-20 w-20 rounded-full border-2 border-green-500 bg-white text-green-500 hover:bg-green-50 hover:text-green-600"
              onClick={() => handleSwipe('connect')}
            >
              <Heart className="h-10 w-10" />
            </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

function SwipeCard({ user }: { user: (typeof placeholderUsers)[0] }) {
  return (
    <Card className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
      <Image
        src={user.avatar}
        alt={user.name}
        fill
        className="object-cover"
        data-ai-hint="portrait"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <CardContent className="absolute bottom-0 w-full p-6 text-white">
        <h3 className="text-2xl font-bold">{user.name}</h3>
        <p className="text-sm">{user.headline}</p>
        <p className="mt-2 text-sm text-gray-300 line-clamp-3">{user.bio}</p>
      </CardContent>
    </Card>
  );
}
