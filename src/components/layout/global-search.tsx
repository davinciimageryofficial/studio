
"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { searchAI } from "@/ai/flows/search-ai";
import { SearchAIOutput } from "@/ai/schemas/search-ai";
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
  const [showResults, setShowResults] = useState(false);


  const handleSearch = async (e?: React.FormEvent, suggestion?: string) => {
    e?.preventDefault();
    const searchQuery = suggestion || query;
    if (!searchQuery.trim()) return;

    if (!suggestion) {
        setQuery(searchQuery);
    }

    setLoading(true);
    setResult(null);
    setShowResults(true); // Show results pane
    setIsActive(false); // Close suggestions on search

    try {
      const output = await searchAI({ query: searchQuery });
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

  const suggestions = [
    "Find a React developer with TypeScript skills",
    "Who are the top designers in London?",
    "Draft a post about the future of AI",
    "What are the latest trends in content marketing?",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(undefined, suggestion);
  };
  
  const searchContainerClass = showResults ? "flex-col h-full" : "";
  const searchBarClass = showResults ? "w-full" : "w-full max-w-3xl";

  return (
    <div className={cn("sticky top-0 z-30 w-full border-b bg-background/80 py-2 backdrop-blur-lg transition-all duration-300", searchContainerClass)}>
        <div className="container flex items-center justify-center gap-4 px-4">
            <div className={cn("flex items-center justify-center gap-2", searchBarClass)}>
                <form 
                    onSubmit={handleSearch} 
                    className="relative w-full"
                    onFocus={() => setIsActive(true)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsActive(false);
                      }
                    }}
                    >
                    <div className="relative w-full transition-all duration-300 ease-in-out">
                      <Input
                          placeholder="Ask AI anything..."
                          className="pl-10"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                      />
                      <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 h-8">
                          Search
                      </Button>
                    </div>
                     {isActive && (
                        <div className="absolute top-full mt-2 w-full rounded-md border bg-background/80 backdrop-blur-lg shadow-lg">
                            <ul>
                                {suggestions.map((s, i) => (
                                    <li key={i}>
                                        <button
                                            type="button"
                                            className="w-full text-left p-3 hover:bg-accent text-sm flex items-center gap-3"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSuggestionClick(s);
                                            }}
                                        >
                                            <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                            <span>{s}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
                {!showResults && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <Bell className="h-5 w-5" />
                          <span className="sr-only">Notifications</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-background/90 backdrop-blur-lg">
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
                )}
            </div>
        </div>

      {showResults && (
        <div className="p-4 mt-4 space-y-4 overflow-y-auto flex-1">
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
      )}

      {!showResults && (
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
      )}
    </div>
  );
}
