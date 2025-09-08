
"use client";

import { useState, useEffect } from "react";
import { getConversationStarters, type ConversationStartersOutput, type ConversationStartersInput } from "@/ai/flows/conversation-starters";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Mood = "professional" | "casual" | "comedic" | "informative";

export function ConversationStarters() {
  const [result, setResult] = useState<ConversationStartersOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>("professional");

  useEffect(() => {
    async function fetchStarters() {
      setLoading(true);
      setError(null);
      try {
        const output = await getConversationStarters({ mood });
        setResult(output);
      } catch (e) {
        setError("Failed to load conversation starters. Please try again later.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchStarters();
  }, [mood]);

  return (
    <div>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Choose a mood:</Label>
          <RadioGroup 
            value={mood} 
            onValueChange={(value) => setMood(value as Mood)} 
            className="mt-2 flex flex-wrap gap-x-4 gap-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="professional" id="r1" />
              <Label htmlFor="r1">Professional</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="casual" id="r2" />
              <Label htmlFor="r2">Casual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comedic" id="r3" />
              <Label htmlFor="r3">Comedic</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="informative" id="r4" />
              <Label htmlFor="r4">Informative</Label>
            </div>
          </RadioGroup>
        </div>

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
    </div>
  );
}
