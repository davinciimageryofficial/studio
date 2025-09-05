
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Zap, AlertCircle, Kanban, CircleDollarSign, Clock, SlidersHorizontal, Settings2, Building } from "lucide-react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSyncNet, type SkillSyncNetInput, type SkillSyncNetOutput } from "@/ai/flows/skill-sync-net";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ClientOnly } from "@/components/layout/client-only";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

const clientFormSchema = z.object({
  projectTitle: z.string().min(5, "Project title must be at least 5 characters."),
  projectDescription: z.string().min(20, "Please provide a detailed project description."),
  requiredSkills: z.string().min(3, "Please list at least one required skill."),
  budget: z.coerce.number().min(1, "Budget must be a positive number."),
  timeline: z.enum(["<1 week", "1-2 weeks", "2-4 weeks", "1-2 months", ">2 months"]),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

const requirementCategories = {
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

type ReqCategory = keyof typeof requirementCategories;
type SelectedReqs = Record<ReqCategory, Record<string, string[]>>;

const freelanceNiches = {
    "Writing & Content Creation": ["Blog Writing", "Copywriting", "Technical Writing", "SEO Writing", "Content Strategy", "Ghostwriting", "Grant Writing", "Scriptwriting", "Editing & Proofreading", "Social Media Content Creation", "Press Release Writing", "UX Writing", "Creative Writing", "Resume & Cover Letter Writing", "Newsletter Writing", "Product Description Writing"],
    "Design & Creative": ["Graphic Design", "UI/UX Design", "Web Design", "Illustration", "Animation", "Video Editing", "Photography", "Photo Editing/Retouching", "3D Modeling & Rendering", "Game Art Design", "Presentation Design", "Packaging Design", "Infographic Design", "Book Cover Design", "Fashion Design", "Interior Design"],
    "Development & IT": ["Web Development (frontend, backend, full-stack)", "Mobile App Development", "Software Development", "Game Development", "WordPress Development", "Shopify Development", "E-commerce Platform Development", "Database Management", "API Integration", "DevOps & Cloud Computing", "Cybersecurity Consulting", "Blockchain Development", "AI/ML Model Development", "Chatbot Development", "IT Support & Network Administration", "SaaS Product Development"],
    "Marketing & Advertising": ["Digital Marketing Strategy", "SEO", "SEM", "Social Media Marketing", "Email Marketing", "Content Marketing", "Affiliate Marketing", "Influencer Marketing", "PPC Campaign Management", "Marketing Analytics", "Brand Strategy", "Market Research", "Public Relations", "Crowdfunding Campaign Management", "Conversion Rate Optimization (CRO)"],
    "Business & Consulting": ["Business Plan Writing", "Financial Consulting", "Bookkeeping & Accounting", "Tax Preparation", "Management Consulting", "HR Consulting", "Project Management", "Operations Consulting", "Startup Consulting", "Virtual CFO Services", "Fundraising Consulting", "Risk Management Consulting", "Supply Chain Consulting", "CRM Setup", "E-commerce Business Consulting"],
    "Admin & Customer Support": ["Virtual Assistance", "Data Entry", "Customer Service", "Technical Support", "Order Processing", "Calendar Management", "Email Management", "Transcription", "Appointment Setting", "Research Assistance", "CRM Data Management", "Community Management"],
    "Sales & Lead Generation": ["Lead Generation", "Cold Calling", "Email Outreach", "Sales Funnel Creation", "B2B Sales Consulting", "LinkedIn Lead Generation", "Telesales", "Customer Retention Strategy", "Sales Copywriting"],
    "Education & Training": ["Online Tutoring", "Course Creation", "Instructional Design", "Corporate Training", "Life Coaching", "Career Coaching", "Test Prep Coaching", "Public Speaking Coaching", "Skill Workshop Facilitation", "Language Instruction", "Music Instruction", "Fitness Coaching"],
    "Audio & Music": ["Voiceover Acting", "Audio Editing & Mixing", "Podcast Production", "Music Composition", "Sound Design", "Audio Restoration", "Jingles & Ad Music Production", "Voice Synthesis & AI Voice Creation", "DJ Services"],
    "Translation & Localization": ["Document Translation", "Website Localization", "Software Localization", "Subtitling & Captioning", "Technical Translation", "Medical Translation", "Legal Translation", "Literary Translation", "Multilingual SEO"],
    "Legal & Compliance": ["Contract Drafting", "Legal Research", "Paralegal Services", "Intellectual Property Consulting", "Compliance Consulting", "GDPR/Data Privacy Consulting", "Immigration Consulting"],
    "Engineering & Architecture": ["CAD Design", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Structural Engineering", "Architectural Design", "Product Design", "Industrial Design", "Prototyping & 3D Printing"],
    "Science & Research": ["Data Analysis", "Statistical Analysis", "Scientific Writing", "Research Paper Editing", "Grant Research", "Qualitative Research", "Quantitative Research", "Bioinformatics Consulting", "Environmental Consulting"],
    "Healthcare & Wellness": ["Telehealth Consulting", "Medical Writing", "Health Coaching", "Nutrition Consulting", "Mental Health Coaching", "Wellness Program Design", "Medical Billing & Coding", "Healthcare Marketing"],
    "Event & Entertainment": ["Event Planning", "Virtual Event Management", "Wedding Planning", "Entertainment Booking", "Stage Design", "Live Streaming Setup", "Virtual Reality Event Production"],
    "Gaming & Esports": ["Game Testing", "Esports Coaching", "Game Streaming Setup", "Game Content Creation", "Esports Event Management", "Game Modding"],
    "AI & Emerging Tech": ["AI Prompt Engineering", "Machine Learning Consulting", "Data Annotation & Labeling", "AI Ethics Consulting", "AR/VR Development", "IoT Consulting", "Metaverse Content Creation"],
    "Miscellaneous": ["Voice Acting for AI/Apps", "Astrology/Tarot Services", "Personal Styling", "Travel Planning", "Genealogy Research", "Virtual Tour Creation", "NFT Creation & Consulting", "Podcast Guest Booking"],
};
type FreelanceNiche = keyof typeof freelanceNiches;
type SelectedNiches = Record<string, string[]>;


function NichePickerDialog({ onSave, initialNiches }: { onSave: (niches: string[]) => void, initialNiches: string[] }) {
    const [selected, setSelected] = useState<SelectedNiches>(() => {
        const initialState: SelectedNiches = {};
        initialNiches.forEach(niche => {
            for (const category in freelanceNiches) {
                if (freelanceNiches[category as FreelanceNiche].includes(niche)) {
                    if (!initialState[category]) {
                        initialState[category] = [];
                    }
                    initialState[category].push(niche);
                }
            }
        });
        return initialState;
    });

    const handleSelect = (category: string, subNiche: string) => {
        setSelected(prev => {
            const newSelection = { ...prev };
            if (!newSelection[category]) {
                newSelection[category] = [];
            }
            const isSelected = newSelection[category].includes(subNiche);
            if (isSelected) {
                newSelection[category] = newSelection[category].filter(s => s !== subNiche);
            } else {
                newSelection[category].push(subNiche);
            }
            return newSelection;
        });
    };
    
    const handleSaveChanges = () => {
        const allSelected = Object.values(selected).flat();
        onSave(allSelected);
    };

    return (
        <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle>Choose Freelancer Category</DialogTitle>
                <DialogDescription>Select the specific skills and niches that best suit your project needs.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto pr-4">
                 <Accordion type="multiple" className="w-full">
                     {Object.entries(freelanceNiches).map(([category, subNiches]) => (
                        <AccordionItem key={category} value={category}>
                            <AccordionTrigger className="text-base font-semibold">{category}</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 pl-2">
                                    {subNiches.map(subNiche => (
                                        <div key={subNiche} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`${category}-${subNiche}`}
                                                checked={selected[category]?.includes(subNiche) || false}
                                                onCheckedChange={() => handleSelect(category, subNiche)}
                                            />
                                            <label htmlFor={`${category}-${subNiche}`} className="text-sm font-medium leading-none">
                                                {subNiche}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
             <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <DialogClose asChild><Button type="button" onClick={handleSaveChanges}>Apply Selection</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}

function AdvancedRequirementsDialog({ onSave }: { onSave: (reqs: string) => void }) {
    const [selectedReqs, setSelectedReqs] = useState<SelectedReqs>({} as SelectedReqs);

    const handleSelect = (mainCategory: ReqCategory, subCategory: string, req: string) => {
        setSelectedReqs(prev => {
            const newSelections = JSON.parse(JSON.stringify(prev));
            if (!newSelections[mainCategory]) newSelections[mainCategory] = {};
            if (!newSelections[mainCategory][subCategory]) newSelections[mainCategory][subCategory] = [];
            
            const currentReqs: string[] = newSelections[mainCategory][subCategory];
            const isSelected = currentReqs.includes(req);

            if (isSelected) {
                newSelections[mainCategory][subCategory] = currentReqs.filter(r => r !== req);
            } else {
                newSelections[mainCategory][subCategory].push(req);
            }
            return newSelections;
        });
    };

    const handleSaveChanges = () => {
        let advancedDescription = "\n\n**Advanced Requirements:**\n";
        const allSelections: string[] = [];

        for (const mainCategory in selectedReqs) {
            const subCategories = selectedReqs[mainCategory as ReqCategory];
            for (const subCategory in subCategories) {
                const reqs = subCategories[subCategory];
                if (reqs.length > 0) {
                    allSelections.push(`- **${subCategory}:** ${reqs.join(', ')}`);
                }
            }
        }
        
        if (allSelections.length > 0) {
            advancedDescription += allSelections.join('\n');
            onSave(advancedDescription);
        } else {
            onSave(""); // Save an empty string if no selections
        }
    };

    return (
        <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle>Advanced Requirements Picker</DialogTitle>
                <DialogDescription>Specify detailed criteria to help the AI find the absolute best match for your project.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto pr-4">
                 <Accordion type="multiple" className="w-full">
                     {Object.entries(requirementCategories).map(([mainCategory, subCategories]) => (
                        <AccordionItem key={mainCategory} value={mainCategory}>
                            <AccordionTrigger className="text-lg font-semibold">{mainCategory}</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4 pl-2">
                                {Object.entries(subCategories).map(([subCategory, reqs]) => (
                                    <div key={subCategory}>
                                        <h5 className="font-medium mb-3">{subCategory}</h5>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-3">
                                            {reqs.map(req => (
                                                <div key={req} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`${mainCategory}-${subCategory}-${req}`}
                                                        checked={selectedReqs[mainCategory as ReqCategory]?.[subCategory]?.includes(req) || false}
                                                        onCheckedChange={() => handleSelect(mainCategory as ReqCategory, subCategory, req)}
                                                    />
                                                    <label htmlFor={`${mainCategory}-${subCategory}-${req}`} className="text-sm font-medium leading-none">
                                                        {req}
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
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <DialogClose asChild><Button type="button" onClick={handleSaveChanges}>Add Requirements</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}

function ClientView() {
    const [result, setResult] = useState<SkillSyncNetOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedNiches, setSelectedNiches] = useState<string[]>([]);

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            projectDescription: "",
            requiredSkills: ""
        }
    });

    const handleAdvancedSave = (requirements: string) => {
        const currentDescription = form.getValues("projectDescription");
        const baseDescription = currentDescription.split("\n\n**Advanced Requirements:**")[0];
        form.setValue("projectDescription", baseDescription + requirements, { shouldValidate: true });
    };

    const handleNicheSave = (niches: string[]) => {
        setSelectedNiches(niches);
        const currentSkills = form.getValues("requiredSkills").split(',').map(s => s.trim()).filter(s => s && !Object.values(freelanceNiches).flat().includes(s));
        const newSkills = [...currentSkills, ...niches].join(', ');
        form.setValue("requiredSkills", newSkills, { shouldValidate: true });
    };

    const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const input: SkillSyncNetInput = {
                context: "client_seeking_freelancer",
                clientBrief: data,
            };
            const output = await skillSyncNet(input);
            setResult(output);
        } catch (e) {
            setError("Failed to find a match. The AI engine may be busy. Please try again.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle>Post a Project</CardTitle>
                    <CardDescription>Describe your project, and our AI will find the perfect freelance expert for you.</CardDescription>
                </CardHeader>
                <CardContent>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="projectTitle">Project Title</Label>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button type="button" variant="outline" size="sm"><Settings2 className="mr-2 h-4 w-4" /> Choose Category</Button>
                                    </DialogTrigger>
                                    <NichePickerDialog onSave={handleNicheSave} initialNiches={selectedNiches} />
                                </Dialog>
                            </div>
                            <Input id="projectTitle" {...form.register("projectTitle")} placeholder="e.g., Redesign of E-commerce Checkout Flow" />
                            {form.formState.errors.projectTitle && <p className="text-sm text-destructive">{form.formState.errors.projectTitle.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="projectDescription">Project Description</Label>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button type="button" variant="outline" size="sm"><SlidersHorizontal className="mr-2 h-4 w-4" /> Add Advanced Requirements</Button>
                                    </DialogTrigger>
                                    <AdvancedRequirementsDialog onSave={handleAdvancedSave} />
                                </Dialog>
                            </div>
                            <Textarea id="projectDescription" {...form.register("projectDescription")} placeholder="Describe the project goals, deliverables, and any specific requirements..." className="min-h-32" />
                            {form.formState.errors.projectDescription && <p className="text-sm text-destructive">{form.formState.errors.projectDescription.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="requiredSkills">Required Skills & Niches</Label>
                            <Input id="requiredSkills" {...form.register("requiredSkills")} placeholder="e.g., Figma, UX Research, Prototyping" />
                            <div className="flex flex-wrap gap-1 pt-1">
                                {selectedNiches.map(niche => (
                                    <Badge key={niche} variant="secondary">{niche}</Badge>
                                ))}
                            </div>
                             {form.formState.errors.requiredSkills && <p className="text-sm text-destructive">{form.formState.errors.requiredSkills.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="budget">Budget ($)</Label>
                                <Input id="budget" type="number" {...form.register("budget")} placeholder="e.g., 5000" />
                                {form.formState.errors.budget && <p className="text-sm text-destructive">{form.formState.errors.budget.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timeline">Timeline</Label>
                                <Controller
                                    name="timeline"
                                    control={form.control}
                                    render={({ field }) => (
                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a timeline" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="<1 week">&lt; 1 Week</SelectItem>
                                                <SelectItem value="1-2 weeks">1-2 Weeks</SelectItem>
                                                <SelectItem value="2-4 weeks">2-4 Weeks</SelectItem>
                                                <SelectItem value="1-2 months">1-2 Months</SelectItem>
                                                <SelectItem value=">2 months">&gt; 2 Months</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {form.formState.errors.timeline && <p className="text-sm text-destructive">{form.formState.errors.timeline.message}</p>}
                            </div>
                        </div>
                         <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            <Zap className="mr-2 h-5 w-5" />
                            {loading ? "Finding Your Perfect Match..." : "Find My Freelancer"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Your AI-Vetted Match</h2>
                {loading && <MatchSkeleton isClientView={true} />}
                {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                {result && result.match && result.match.freelancer && <FreelancerMatchCard freelancer={result.match.freelancer} />}
                {!loading && !result && !error && (
                    <Card className="flex flex-col items-center justify-center h-full border-dashed min-h-80">
                        <div className="text-center text-muted-foreground p-8">
                            <Zap className="mx-auto h-12 w-12 mb-4" />
                            <h3 className="text-lg font-semibold">Your matched freelancer will appear here.</h3>
                            <p>Fill out the project details to get started.</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

function FreelancerView() {
    const [result, setResult] = useState<SkillSyncNetOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFindProject = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const currentUser = placeholderUsers.find(u => u.id === '2');
            const input: SkillSyncNetInput = {
                context: "freelancer_seeking_project",
                freelancerProfile: {
                    headline: currentUser!.headline,
                    bio: currentUser!.bio,
                    skills: currentUser!.skills,
                }
            };
            const output = await skillSyncNet(input);
            setResult(output);
        } catch (e) {
            setError("Failed to find a project. The AI engine may be busy. Please try again.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Instant Project Matching</CardTitle>
                    <CardDescription>Our AI analyzes your profile to find the perfect project for you, on demand.</CardDescription>
                </CardHeader>
                <CardContent className="text-center p-12">
                    <p className="mb-6 text-muted-foreground">Ready for your next gig? Let our AI find a project that perfectly matches your skills and experience.</p>
                    <Button size="lg" className="h-16 text-lg bg-black text-white hover:bg-gray-800" onClick={handleFindProject} disabled={loading}>
                        <Zap className="mr-3 h-6 w-6" />
                        {loading ? "Scanning for Projects..." : "Find Instant Match"}
                    </Button>
                </CardContent>
            </Card>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Your AI-Matched Project</h2>
                {loading && <MatchSkeleton isClientView={false} />}
                {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                {result && result.match && result.match.project && <ProjectMatchCard project={result.match.project} />}
                 {!loading && !result && !error && (
                    <Card className="flex flex-col items-center justify-center h-full border-dashed min-h-80">
                        <div className="text-center text-muted-foreground p-8">
                            <Zap className="mx-auto h-12 w-12 mb-4" />
                            <h3 className="text-lg font-semibold">Your matched project will appear here.</h3>
                            <p>Click the "Find Instant Match" button to start.</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

function MatchSkeleton({ isClientView }: { isClientView: boolean }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    {isClientView && <Skeleton className="h-16 w-16 rounded-full" />}
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                 <div className="pt-4 space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}

function FreelancerMatchCard({ freelancer }: { freelancer: NonNullable<NonNullable<SkillSyncNetOutput['match']>['freelancer']>}) {
     return (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-2xl">{freelancer.name}</CardTitle>
                        <p className="text-muted-foreground">{freelancer.headline}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold mb-2">AI Match Assessment</h4>
                    <Progress value={freelancer.matchConfidence} className="h-3 mb-2" />
                    <p className="text-sm text-muted-foreground">{freelancer.matchReasoning}</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Vetted Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {freelancer.skills.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" size="lg">Send Project Invite</Button>
            </CardFooter>
        </Card>
    );
}

function ProjectMatchCard({ project }: { project: NonNullable<NonNullable<SkillSyncNetOutput['match']>['project']>}) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <CardDescription>Posted by: {project.clientName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold mb-2">AI Match Assessment</h4>
                    <Progress value={project.matchConfidence} className="h-3 mb-2" />
                    <p className="text-sm text-muted-foreground">{project.matchReasoning}</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Project Details</h4>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Budget</p>
                                <p>${project.budget.toLocaleString()}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Timeline</p>
                                <p>{project.timeline}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.requiredSkills.map(skill => (
                            <Badge key={skill}>{skill}</Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" size="lg">Accept Project Instantly</Button>
            </CardFooter>
        </Card>
    );
}

export default function SkillSyncNetPage() {
    return (
        <ClientOnly>
            <div className="p-4 sm:p-6 md:p-8">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight font-headline-tech uppercase">Skill Sync Net</h1>
                    <p className="mt-2 text-lg text-muted-foreground max-w-3xl mx-auto">
                        The intelligent marketplace for elite freelancers and innovative projects. Forget endless scrolling. Get the perfect match, instantly.
                    </p>
                </header>

                <Tabs defaultValue="client" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto bg-black text-muted-foreground">
                        <TabsTrigger value="client" className="gap-2">
                            <Kanban className="h-5 w-5" /> Businesses
                        </TabsTrigger>
                        <TabsTrigger value="freelancer" className="gap-2">
                            <Kanban className="h-5 w-5" /> Freelancers
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="client" className="mt-8">
                        <ClientView />
                    </TabsContent>
                    <TabsContent value="freelancer" className="mt-8">
                        <FreelancerView />
                    </TabsContent>
                </Tabs>
            </div>
        </ClientOnly>
    );
}

    