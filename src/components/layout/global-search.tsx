
"use client";

import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { searchAI } from "@/ai/flows/search-ai";
import { SearchAIInput, SearchAIOutput } from "@/ai/schemas/search-ai";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchAIOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setIsDialogOpen(true);

    try {
      const output = await searchAI({ query });
      setResult(output);
    } catch (error) {
      console.error("AI search failed:", error);
      setResult({ answer: "Sorry, I couldn't process that request. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  
  const notifications = [
    { user: placeholderUsers[2], action: "viewed your profile.", time: "2h" },
    { user: placeholderUsers[3], action: "sent you a connection request.", time: "1d" },
    { user: placeholderUsers[4], action: "accepted your connection request.", time: "2d" },
  ];

  return (
    <>
      <div className="sticky top-0 z-20 w-full border-b bg-background/80 py-2 backdrop-blur-lg transition-all duration-300">
        <div className="container flex items-center justify-center gap-4 px-4">
            <div className="flex w-full max-w-2xl items-center gap-2">
                <form 
                    onSubmit={handleSearch} 
                    onMouseEnter={() => setIsActive(true)}
                    onMouseLeave={() => setIsActive(false)}
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setIsActive(false)}
                    className={cn(
                        "relative w-full transition-all duration-300 ease-in-out",
                        isActive ? "max-w-xl" : "max-w-sm"
                        )}
                    >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Ask AI anything..."
                        className="pl-10"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 h-8">
                        Search
                    </Button>
                </form>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-background/80 backdrop-blur-lg">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.map((item, index) => (
                      <DropdownMenuItem key={index} className="flex items-start gap-3 p-3">
                         <Avatar className="h-9 w-9">
                            <AvatarImage src={item.user.avatar} alt={item.user.name} />
                            <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-sm whitespace-normal">
                                <span className="font-semibold">{item.user.name}</span> {item.action}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="font-semibold">Your question:</div>
            <p className="p-3 rounded-md bg-muted">{query}</p>
            <div className="font-semibold">Answer:</div>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="p-3 rounded-md bg-muted whitespace-pre-wrap">
                {result?.answer}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
