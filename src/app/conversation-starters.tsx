
"use client";

import { useState, useEffect } from "react";
import { getConversationStarters, type ConversationStartersOutput } from "@/ai/flows/conversation-starters";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ConversationStarters() {
  const [result, setResult] = useState<ConversationStartersOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStarters() {
      setLoading(true);
      setError(null);
      try {
        const output = await getConversationStarters();
        setResult(output);
      } catch (e) {
        setError("Failed to load conversation starters. Please try again later.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchStarters();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Lightbulb className="w-5 h-5" />
        Pocket Guide
      </h3>
      <div className="mt-4 space-y-3">
        {loading && (
          <>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/6" />
          </>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {result && (
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            {result.topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
