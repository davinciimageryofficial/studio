
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const formSchema = z.object({
  userProfile: z.string().min(10, "Please provide a profile description or select traits from the picker."),
  categorization: z.enum(["design", "writing", "development"]),
  teamSize: z.coerce.number().int().min(1, "Team size must be at least 1.").max(10, "Team size cannot exceed 10."),
});

type FormValues = z.infer<typeof formSchema>;

const traitCategories = {
  "Professional Skills Development": {
    "Technical Skills": ["Python", "JavaScript", "Web Development", "Graphic Design", "Video Editing", "UX/UI Design", "Data Analysis", "Cybersecurity", "AI/ML", "Cloud Computing"],
    "Creative Skills": ["Copywriting", "Content Writing", "Technical Writing", "Illustration", "Photography", "Animation", "Music Production", "Voice Acting"],
    "Soft Skills": ["Communication", "Time Management", "Negotiation", "Problem-solving", "Adaptability", "Emotional Intelligence"],
    "Industry-Specific Knowledge": ["Marketing", "Healthcare", "Finance", "Education", "E-commerce"],
    "Portfolio Building": ["Curating a portfolio"],
  },
  "Business and Entrepreneurship": {
    "Branding and Marketing": ["Personal Branding", "Social Media Marketing", "SEO", "Content Marketing", "Email Marketing"],
    "Client Acquisition": ["Upwork", "Fiverr", "LinkedIn", "Pitching", "Networking", "Cold Emailing"],
    "Pricing and Negotiation": ["Setting Rates", "Value-Based Pricing", "Scope Creep", "Contract Negotiation"],
    "Financial Management": ["Budgeting", "Invoicing", "Expense Tracking", "Tax Preparation", "Retirement Planning"],
    "Business Operations": ["Trello", "Asana", "Time Tracking", "CRM"],
    "Legal Considerations": ["Contracts", "NDAs", "Intellectual Property", "Freelancing Laws"],
    "Scaling a Freelance Business": ["Hiring Subcontractors", "Agency Model", "Outsourcing Tasks"],
  },
  "Technology and Tools": {
    "Productivity Tools": ["Notion", "ClickUp", "Slack", "Zoom", "Google Drive", "Dropbox"],
    "Creative Software": ["Adobe Creative Suite", "Canva", "Final Cut Pro", "Blender", "Pro Tools"],
    "Development Tools": ["VS Code", "Git", "Testing Frameworks"],
    "Automation and AI": ["ChatGPT", "Jasper", "Workflow Automation"],
    "Cybersecurity Tools": ["VPNs", "Secure File Transfers", "Password Management"],
    "Website and Online Presence": ["Personal Website Building", "Domain Management", "Hosting Services", "WordPress"],
  },
  "Marketing and Self-Promotion": {
    "Social Media": ["LinkedIn", "X", "Instagram", "TikTok"],
    "Content Creation": ["Blogging", "Vlogging", "Podcasting"],
    "SEO and Online Visibility": ["Keyword Research", "Freelance Platform Optimization", "Google My Business"],
    "Networking": ["Virtual Events", "In-person Events", "Professional Groups", "Collaborations"],
    "Testimonials and Reviews": ["Collecting Client Feedback", "Case Studies"],
    "Advertising": ["Google Ads", "LinkedIn Ads", "Sponsored Content"],
  },
  "Personal Development and Well-Being": {
    "Work-Life Balance": ["Managing Burnout", "Setting Boundaries", "Sustainable Schedule"],
    "Mental Health": ["Stress Management", "Mindfulness", "Therapy Resources"],
    "Physical Health": ["Ergonomics", "Exercise Routines"],
    "Motivation and Discipline": ["Goal Setting", "Overcoming Procrastination", "Building Habits"],
    "Continuous Learning": ["Reading Blogs", "Listening to Podcasts", "Attending Webinars"],
  },
  "Finance and Economics": {
    "Income Diversification": ["Digital Products", "Online Courses"],
    "Tax Compliance": ["Self-Employment Taxes", "Deductions", "Quarterly Payments"],
    "Invoicing and Payments": ["PayPal", "Stripe", "Wise", "Handling Late Payments"],
    "Budgeting for Irregular Income": ["Cash Flow Management", "Emergency Funds"],
    "Investing": ["SEP IRA", "Solo 401(k)", "Stock Market Basics"],
  },
  "Client and Project Management": {
    "Client Communication": ["Managing Expectations", "Handling Difficult Clients"],
    "Project Scoping": ["Defining Deliverables", "Timelines", "Milestones"],
    "Conflict Resolution": ["Handling Disputes", "Managing Scope Creep"],
    "Feedback Loops": ["Gathering Feedback", "Iterative Improvements"],
    "Time Management": ["Prioritizing Tasks", "Meeting Deadlines"],
  },
  "Industry-Specific Trends": {
    "Gig Economy": ["Freelance Marketplaces", "Remote Work Trends"],
    "Emerging Technologies": ["Blockchain", "Web3", "AR/VR", "Generative AI", "IoT"],
    "Sustainability": ["Green Freelancing", "Eco-conscious Clients"],
    "Global Markets": ["International Freelancing", "Currency Exchange"],
    "Niche Specialization": ["Fintech", "Edtech", "Healthtech", "Gaming"],
  },
  "Community and Networking": {
    "Freelance Communities": ["Reddit", "Discord", "Local Meetups", "Coworking Spaces"],
    "Mentorship": ["Finding Mentors", "Peer Accountability"],
    "Collaborations": ["Partnering with Freelancers"],
    "Professional Associations": ["Freelancers Union"],
  },
  "Legal and Ethical Considerations": {
    "Contracts and Agreements": ["Drafting Contracts", "Understanding Terms"],
    "Intellectual Property": ["Copyright", "Trademarks", "Licensing"],
    "Ethics": ["Transparency", "Avoiding Conflicts of Interest", "Data Privacy"],
    "Compliance": ["Labor Laws", "GDPR"],
  },
  "Education and Training": {
    "Online Learning Platforms": ["Coursera", "Udemy", "LinkedIn Learning", "Skillshare"],
    "Events": ["Workshops", "Conferences", "Webinars", "Virtual Summits"],
    "Peer Learning": ["Study Groups", "Masterminds"],
    "Language Skills": ["Spanish", "Mandarin"],
  },
  "Lifestyle and Remote Work": {
    "Remote Work Setup": ["Home Office Ergonomics", "Internet Reliability", "Hardware"],
    "Digital Nomadism": ["Traveling while Freelancing", "Visas", "Coworking Abroad"],
    "Time Zone Management": ["Working with Global Clients"],
    "Minimalism and Productivity": ["Decluttering Workspaces", "Simplifying Workflows"],
  },
  "Data and Analytics": {
    "Performance Tracking": ["Measuring Project Success", "Client Satisfaction", "ROI"],
    "Analytics Tools": ["Google Analytics", "Social Media Insights"],
    "Data-Driven Decisions": ["Optimizing Pricing", "Marketing Strategy"],
    "Client Reporting": ["Creating Reports", "Dashboards", "Visualizations"],
  },
  "Creative and Innovation": {
    "Ideation Techniques": ["Brainstorming", "Mind Mapping", "Design Thinking"],
    "Experimentation": ["Testing New Services", "New Niches"],
    "Trend Awareness": ["Following Design Trends", "Tech Trends", "Cultural Trends"],
    "Storytelling": ["Branding Narratives", "Client Pitches"],
  },
  "Risk Management": {
    "Insurance": ["Health Insurance", "Liability Insurance"],
    "Backup Plans": ["Data Backups", "Income Diversification", "Client Diversification"],
    "Client Vetting": ["Identifying Red Flags", "Avoiding Scams"],
    "Crisis Management": ["Handling Project Failures", "Client Disputes"],
  },
};

type TraitCategory = keyof typeof traitCategories;
type SelectedTraits = Record<TraitCategory, Record<string, string[]>>;


function TraitPickerDialog({ onSave }: { onSave: (traits: string) => void }) {
    const [selectedTraits, setSelectedTraits] = useState<SelectedTraits>({} as SelectedTraits);

    const handleSelect = (mainCategory: TraitCategory, subCategory: string, trait: string) => {
        setSelectedTraits(prev => {
            const newSelections = { ...prev };
            
            // Ensure main category and subcategory exist
            if (!newSelections[mainCategory]) {
                newSelections[mainCategory] = {};
            }
            if (!newSelections[mainCategory][subCategory]) {
                newSelections[mainCategory][subCategory] = [];
            }

            const currentTraits = newSelections[mainCategory][subCategory];
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
      form.setValue("userProfile", traits, { shouldValidate: true });
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
