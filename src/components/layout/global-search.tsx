
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, Lightbulb, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchAI, type SearchAIOutput } from "@/ai/flows/search-ai";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSidebar } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

type Message = {
    sender: 'user' | 'ai';
    text: string;
    destination?: string;
};

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuggestionsActive, setIsSuggestionsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { state: sidebarState } = useSidebar();
  const router = useRouter();
  const followUpInputRef = useRef<HTMLInputElement>(null);


  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setConversation(prev => [...prev, { sender: 'user', text: searchQuery }]);
    if (!showResults) setShowResults(true); 
    setIsSuggestionsActive(false);

    try {
      const output: SearchAIOutput = await searchAI({ query: searchQuery });
      
      const aiResponse: Message = { sender: 'ai', text: output.answer };
      if (output.destination) {
        aiResponse.destination = output.destination;
      }
      setConversation(prev => [...prev, aiResponse]);

      if (output.destination) {
        const path = output.destination === 'profile' ? '/profile/me' : `/${output.destination}`;
        router.push(path);
        // We might want to close the search pane on navigation
        // For now, we'll leave it open so the user sees the confirmation message.
      }

    } catch (error) {
      console.error("AI search failed:", error);
      const errorResponse: Message = { sender: 'ai', text: "Sorry, I couldn't process that request. Please try again." };
      setConversation(prev => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading && followUpInputRef.current) {
        followUpInputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [loading]);
  
  const notifications = [
    { user: placeholderUsers[2], action: "viewed your profile.", time: "2h" },
    { user: placeholderUsers[3], action: "sent you a connection request.", time: "1d" },
    { user: placeholderUsers[4], action: "accepted your connection request.", time: "2d" },
  ];

  const suggestions = [
    "Open the courses page",
    "Who are the top designers in London?",
    "Show me my profile",
    "What are the latest trends in content marketing?",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };
  
  const searchContainerClass = showResults ? "flex-col h-full absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-lg z-40 p-4" : "";
  const searchBarClass = showResults ? "w-full" : "w-full transition-all duration-300 ease-in-out";

  const closeSearch = () => {
    setShowResults(false);
    setConversation([]);
    setQuery("");
  }

  return (
    <div className={cn(
        "sticky top-0 z-30 w-full border-b bg-background/60 py-2 backdrop-blur-xl transition-all duration-300", 
        showResults ? "h-[calc(100vh-8rem)]" : ""
    )}>
        <div className={cn("container flex items-center justify-center gap-4 px-4", showResults && "flex-col h-full")}>
            <div className={cn(
                "flex items-center justify-center gap-2", 
                searchBarClass,
                sidebarState === 'collapsed' ? 'max-w-5xl' : 'max-w-3xl',
                showResults && "!max-w-full"
            )}>
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} 
                    className="relative w-full"
                    onFocus={() => setIsSuggestionsActive(true)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsSuggestionsActive(false);
                      }
                    }}
                    >
                    <div className="relative w-full transition-all duration-300 ease-in-out">
                      <Input
                          placeholder="Ask AI anything or type a command..."
                          className="pl-10"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                      />
                      <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 h-8">
                          Search
                      </Button>
                    </div>
                     {isSuggestionsActive && !showResults && (
                        <div className="absolute top-full mt-2 w-full rounded-md border bg-background/95 backdrop-blur-lg shadow-lg">
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
                 {showResults && (
                    <Button variant="ghost" size="icon" onClick={closeSearch}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close Search</span>
                    </Button>
                 )}
            </div>
             {showResults && (
                <div className="flex flex-col h-full w-full max-w-3xl overflow-hidden">
                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        <div className="space-y-6">
                            {conversation.map((msg, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        {msg.sender === 'ai' ? (
                                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="7"></circle><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                <User className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 rounded-md p-3 bg-muted">
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center animate-pulse">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="7"></circle><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                                    </div>
                                    <div className="flex-1 space-y-2 rounded-md p-3 bg-muted">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <form 
                        onSubmit={(e) => { e.preventDefault(); const val = (e.target as any).elements.followup.value; handleSearch(val); (e.target as any).reset(); }}
                        className="mt-4 border-t pt-4"
                    >
                        <div className="relative">
                            <Input
                                name="followup"
                                ref={followUpInputRef}
                                placeholder="Ask a follow-up..."
                                className="pr-12"
                                disabled={loading}
                            />
                             <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8" disabled={loading}>
                                Send
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    </div>
  );
}

    
    