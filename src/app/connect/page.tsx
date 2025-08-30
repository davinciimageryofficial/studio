
import { placeholderUsers } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Heart, X, RotateCcw } from "lucide-react";
import Image from "next/image";

export default function ConnectPage() {
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
        >
          <CarouselContent>
            {placeholderUsers.map((user, index) => (
              <CarouselItem key={index}>
                <SwipeCard user={user} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 -translate-y-1/2 h-20 w-20 rounded-full border-2 border-red-500 bg-white text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-10 w-10" />
            </Button>
          </CarouselPrevious>
          <CarouselNext asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 h-20 w-20 rounded-full border-2 border-green-500 bg-white text-green-500 hover:bg-green-50 hover:text-green-600"
            >
              <Heart className="h-10 w-10" />
            </Button>
          </CarouselNext>
        </Carousel>
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full border-2 border-yellow-500 text-yellow-500"
          >
            <RotateCcw className="h-8 w-8" />
          </Button>
        </div>
      </div>
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
