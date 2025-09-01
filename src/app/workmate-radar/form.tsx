
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  aiWorkmateRadar,
  AIWorkmateRadarInput,
  AIWorkmateRadarOutput,
} from "@/ai/flows/ai-workmate-radar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, User, SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  userProfile: z.string().min(10, "Please provide a profile description or select traits from the picker."),
  categorization: z.enum(["design", "writing", "development"]),
  teamSize: z.coerce.number().int().min(1, "Team size must be at least 1.").max(10, "Team size cannot exceed 10."),
});

type FormValues = z.infer<typeof formSchema>;

const traitCategories = {
    skills: ["React", "Node.js", "Python", "Figma", "UI/UX Design", "Copywriting", "SEO", "Project Management", "Data Analysis", "Go"],
    interests: ["Fintech", "Healthcare Tech", "AI/ML", "E-commerce", "SaaS", "Mobile Apps", "Gaming", "Social Impact"],
    expertise: ["Entry-Level", "Mid-Level", "Senior", "Lead", "Principal"]
};

function TraitPickerDialog({ onSave }: { onSave: (traits: string) => void }) {
    const [selectedTraits, setSelectedTraits] = useState<Record<string, string[]>>({
        skills: [],
        interests: [],
        expertise: [],
    });

    const handleSelect = (category: keyof typeof traitCategories, trait: string) => {
        setSelectedTraits(prev => {
            const currentCategoryTraits = prev[category];
            const isSelected = currentCategoryTraits.includes(trait);
            
            if (category === 'expertise') {
                 // Single choice for expertise
                return { ...prev, [category]: [trait] };
            }

            // Multi-choice for others
            const newCategoryTraits = isSelected
                ? currentCategoryTraits.filter(t => t !== trait)
                : [...currentCategoryTraits, trait];

            return { ...prev, [category]: newCategoryTraits };
        });
    };
    
    const handleSaveChanges = () => {
        const description = `Looking for collaborators with the following profile: Skills in ${selectedTraits.skills.join(', ') || 'any field'}. Interested in ${selectedTraits.interests.join(', ') || 'any industry'}. Expertise level: ${selectedTraits.expertise.join(', ') || 'any level'}.`;
        onSave(description);
    };

    return (
         <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Trait Picker</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                {Object.entries(traitCategories).map(([category, traits]) => (
                    <div key={category}>
                        <h4 className="font-semibold text-lg capitalize mb-3">{category}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {traits.map(trait => (
                                <div key={trait} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${category}-${trait}`}
                                        checked={selectedTraits[category as keyof typeof traitCategories]?.includes(trait)}
                                        onCheckedChange={() => handleSelect(category as keyof typeof traitCategories, trait)}
                                    />
                                    <label htmlFor={`${category}-${trait}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {trait}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <Separator className="mt-6" />
                    </div>
                ))}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" onClick={handleSaveChanges}>Save</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}

export function WorkmateRadarForm() {
  const [result, setResult] = useState<AIWorkmateRadarOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: "",
      categorization: "development",
      teamSize: 3,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const output = await aiWorkmateRadar(data);
      setResult(output);
    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTraitsSave = (traits: string) => {
      form.setValue("userProfile", traits);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="userProfile"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                    <FormLabel>Your Profile / Project Description</FormLabel>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Trait Picker
                            </Button>
                        </DialogTrigger>
                        <TraitPickerDialog onSave={handleTraitsSave} />
                    </Dialog>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Describe yourself, your skills, or the project you're building. Or, use the Trait Picker to generate a description."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The more detail you provide, the better the matches will be.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
              control={form.control}
              name="categorization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expertise Needed</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Members</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Find My Dream Team"}
          </Button>
        </form>
      </Form>

      {loading && <ResultsSkeleton />}
      {error && <ErrorAlert message={error} />}
      {result && <ResultsDisplay result={result} />}
    </div>
  );
}

function ResultsSkeleton() {
    return (
        <div className="mt-8">
            <Skeleton className="h-8 w-1/3 mb-6" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <div className="space-y-2 pt-2">
                                <Skeleton className="h-4 w-1/4" />
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function ErrorAlert({ message }: { message: string }) {
    return (
        <Alert variant="destructive" className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}


function ResultsDisplay({ result }: { result: AIWorkmateRadarOutput }) {
  if (!result.suggestedMembers || result.suggestedMembers.length === 0) {
    return (
      <Card className="mt-8 text-center">
        <CardContent className="p-8">
          <User className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Members Found</h3>
          <p className="mt-1 text-muted-foreground">
            We couldn&apos;t find any matches based on your criteria. Try adjusting your profile description.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-6 text-2xl font-bold tracking-tight">Suggested Team Members</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {result.suggestedMembers.map((member) => (
          <Card key={member.profileId} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle>{member.name}</CardTitle>
                  <div>
                    <p className="text-sm font-medium text-primary">Match Score: {member.matchScore}%</p>
                    <Progress value={member.matchScore} className="h-2" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <p className="text-sm text-muted-foreground">{member.shortBio}</p>
              <div>
                <h4 className="mb-2 text-sm font-semibold">Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
