
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, User, Zap, AlertCircle, Kanban, CircleDollarSign, Clock } from "lucide-react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { skillSyncNet, type SkillSyncNetInput, type SkillSyncNetOutput } from "@/ai/flows/skill-sync-net";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ClientOnly } from "@/components/layout/client-only";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";

const clientFormSchema = z.object({
  projectTitle: z.string().min(5, "Project title must be at least 5 characters."),
  projectDescription: z.string().min(20, "Please provide a detailed project description."),
  requiredSkills: z.string().min(3, "Please list at least one required skill."),
  budget: z.coerce.number().min(1, "Budget must be a positive number."),
  timeline: z.enum(["<1 week", "1-2 weeks", "2-4 weeks", "1-2 months", ">2 months"]),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

function ClientView() {
    const [result, setResult] = useState<SkillSyncNetOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
    });

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
        <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Post a Project</CardTitle>
                    <CardDescription>Describe your project, and our AI will find the perfect freelance expert for you.</CardDescription>
                </CardHeader>
                <CardContent>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="projectTitle">Project Title</Label>
                            <Input id="projectTitle" {...form.register("projectTitle")} placeholder="e.g., Redesign of E-commerce Checkout Flow" />
                            {form.formState.errors.projectTitle && <p className="text-sm text-destructive">{form.formState.errors.projectTitle.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="projectDescription">Project Description</Label>
                            <Textarea id="projectDescription" {...form.register("projectDescription")} placeholder="Describe the project goals, deliverables, and any specific requirements..." className="min-h-32" />
                            {form.formState.errors.projectDescription && <p className="text-sm text-destructive">{form.formState.errors.projectDescription.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="requiredSkills">Required Skills</Label>
                            <Input id="requiredSkills" {...form.register("requiredSkills")} placeholder="e.g., Figma, UX Research, Prototyping" />
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
            // Using placeholderUsers[1] (Bob Williams) as the current freelancer for this example
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
        <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Instant Project Matching</CardTitle>
                    <CardDescription>Our AI analyzes your profile to find the perfect project for you, on demand.</CardDescription>
                </CardHeader>
                <CardContent className="text-center p-12">
                    <p className="mb-6 text-muted-foreground">Ready for your next gig? Let our AI find a project that perfectly matches your skills and experience.</p>
                    <Button size="lg" className="h-16 text-lg" onClick={handleFindProject} disabled={loading}>
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
                    <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
                        <TabsTrigger value="client" className="gap-2">
                            <Kanban className="h-5 w-5" /> For Clients
                        </TabsTrigger>
                        <TabsTrigger value="freelancer" className="gap-2">
                            <User className="h-5 w-5" /> For Freelancers
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
