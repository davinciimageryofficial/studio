
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
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

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchAIOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <>
      <div className="sticky top-0 z-20 w-full bg-black/40 py-4 backdrop-blur-lg border-b transition-all duration-300">
        <form 
          onSubmit={handleSearch} 
          className={cn(
            "relative w-full max-w-2xl mx-auto transition-all duration-300 ease-in-out",
            isScrolled && "max-w-md hover:max-w-2xl focus-within:max-w-2xl"
            )}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Ask AI anything..."
            className="pl-10 bg-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 h-8">
            Search
          </Button>
        </form>
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
