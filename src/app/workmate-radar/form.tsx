
"use client";

import { useState, useEffect } from "react";
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
import { AlertCircle, User, SlidersHorizontal, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getCurrentUser } from "@/lib/database";
import type { User as UserType } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const formSchema = z.object({
  userProfile: z.string().min(10, "Please provide a profile description or select traits from the picker."),
  categorization: z.enum(["design", "writing", "development"]),
  teamSize: z.coerce.number().int().min(1, "Team size must be at least 1.").max(10, "Team size cannot exceed 10."),
});

type FormValues = z.infer<typeof formSchema>;

const traitCategories = {
    "Project & Scope": {
        "Project Type": ["One-time task", "Short-term project", "Long-term engagement", "Full-time contract", "Consultation"],
        "Project Scale": ["Small (Individual Contributor)", "Medium (Small Team Collaboration)", "Large (Complex, Multi-team)"],
        "Deliverables": ["Strategy/Plan", "Creative Assets (e.g., designs, content)", "Code/Software", "Analysis & Reports", "Hands-on Implementation"],
    },
    "Experience Level & Seniority": {
        "Seniority": ["Entry-Level/Junior", "Mid-Level", "Senior", "Expert/Lead"],
        "Key Attributes": ["Strategic Thinker", "Technical Specialist", "Creative Visionary", "Project Manager", "Data-driven"],
        "Tool Proficiency": ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
    "Collaboration & Communication": {
        "Working Style": ["Independent/Autonomous", "Highly Collaborative", "Agile/Scrum", "Asynchronous"],
        "Communication": ["Daily Check-ins", "Weekly Syncs", "Prefers Written Updates", "Client-facing"],
        "Team Structure": ["Works directly with client", "Integrates with an existing team", "Leads a team"],
    },
    "Industry & Domain": {
        "Industry Experience": ["Tech/SaaS", "Creative/Media", "Business/Finance", "Healthcare/Science", "Education", "E-commerce/Retail", "Legal/Compliance"],
        "Company Size": ["Startup (1-50)", "Scale-up (51-500)", "Enterprise (500+)", "Non-profit"],
        "Target Audience": ["B2B", "B2C", "Internal", "Specialized/Niche"],
    },
    "Soft Skills & Professionalism": {
        "Pace & Urgency": ["Fast-paced, deadline-driven", "Steady and planned", "Flexible and iterative"],
        "Attention to Detail": ["Pixel-perfect precision", "High-level concepts", "Balanced approach"],
        "Problem Solving": ["Requires strong analytical skills", "Needs creative problem-solving", "Prefers structured guidance"],
    }
};

type TraitCategory = keyof typeof traitCategories;
type SelectedTraits = Record<TraitCategory, Record<string, string[]>>;


function TraitPickerDialog({ onSave }: { onSave: (traits: string) => void }) {
    const [selectedTraits, setSelectedTraits] = useState<SelectedTraits>({} as SelectedTraits);

    const handleSelect = (mainCategory: TraitCategory, subCategory: string, trait: string) => {
        setSelectedTraits(prev => {
            const newSelections = JSON.parse(JSON.stringify(prev)); // Deep copy to avoid mutation
            
            if (!newSelections[mainCategory]) {
                newSelections[mainCategory] = {};
            }
            if (!newSelections[mainCategory][subCategory]) {
                newSelections[mainCategory][subCategory] = [];
            }

            const currentTraits: string[] = newSelections[mainCategory][subCategory];
            const isSelected = currentTraits.includes(trait);

            if (isSelected) {
                newSelections[mainCategory][subCategory] = currentTraits.filter(t => t !== trait);
            } else {
                newSelections[mainCategory][subCategory].push(trait);
            }
            
            return newSelections;
        });
    };
    
    const handleSaveChanges = () => {
        let description = "Seeking collaborators with the following profile: ";
        const allSelections: string[] = [];

        for (const mainCategory in selectedTraits) {
            const subCategories = selectedTraits[mainCategory as TraitCategory];
            const mainCategorySelections: string[] = [];

            for (const subCategory in subCategories) {
                const traits = subCategories[subCategory];
                if (traits.length > 0) {
                    mainCategorySelections.push(`${subCategory}: ${traits.join(', ')}`);
                }
            }

            if (mainCategorySelections.length > 0) {
                allSelections.push(`${mainCategory} (${mainCategorySelections.join('; ')})`);
            }
        }
        
        if (allSelections.length > 0) {
            description += allSelections.join('. ');
        } else {
            description = ""; // Reset if nothing is selected
        }
        
        onSave(description);
    };

    return (
         <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle>Trait Picker</DialogTitle>
                <DialogDescription>Select the skills, interests, and expertise you're looking for in a collaborator.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto pr-4">
                <Accordion type="multiple" className="w-full">
                     {Object.entries(traitCategories).map(([mainCategory, subCategories]) => (
                        <AccordionItem key={mainCategory} value={mainCategory}>
                            <AccordionTrigger className="text-lg font-semibold">{mainCategory}</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4 pl-2">
                                {Object.entries(subCategories).map(([subCategory, traits]) => (
                                    <div key={subCategory}>
                                        <h5 className="font-medium mb-3">{subCategory}</h5>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-3">
                                            {traits.map(trait => (
                                                <div key={trait} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`${mainCategory}-${subCategory}-${trait}`}
                                                        checked={selectedTraits[mainCategory as TraitCategory]?.[subCategory]?.includes(trait) || false}
                                                        onCheckedChange={() => handleSelect(mainCategory as TraitCategory, subCategory, trait)}
                                                    />
                                                    <label htmlFor={`${mainCategory}-${subCategory}-${trait}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        {trait}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
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
  const [autoMatching, setAutoMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkUser() {
        const user = await getCurrentUser();
        setIsLoggedIn(!!user);
    }
    checkUser();
  }, []);

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
    setAutoMatching(false);
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
      form.setValue("userProfile", traits, { shouldValidate: true });
  }

  const handleAutomatch = async () => {
    setAutoMatching(true);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            throw new Error("Could not find current user to automatch.");
        }
        const autoProfile = `This user has the headline "${currentUser.headline}". Their bio is: "${currentUser.bio}". Their skills include: ${currentUser.skills.join(", ")}. Find collaborators who would complement this user's profile.`;
        
        const output = await aiWorkmateRadar({
            userProfile: autoProfile,
            categorization: form.getValues("categorization"),
            teamSize: form.getValues("teamSize"),
        });
        setResult(output);
    } catch (e) {
        setError("An unexpected error occurred during automatch. Please try again.");
        console.error(e);
    } finally {
        setLoading(false);
        setAutoMatching(false);
    }
  };

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
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && !autoMatching ? "Analyzing..." : "Find My Dream Team"}
            </Button>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex-1">
                            <Button 
                                type="button" 
                                variant="outline" 
                                disabled={loading || !isLoggedIn} 
                                onClick={handleAutomatch} 
                                className="w-full"
                            >
                                <Zap className="mr-2 h-4 w-4" />
                                {loading && autoMatching ? "Automatching..." : "Automatch From My Profile"}
                            </Button>
                        </div>
                    </TooltipTrigger>
                    {!isLoggedIn && (
                        <TooltipContent>
                            <p>You must be logged in to use automatch.</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
          </div>
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
