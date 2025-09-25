
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Mail, CheckCircle, MapPin, Link as LinkIcon, Edit, Plus, Trash2, X, Building, Calendar, Twitter, Linkedin, Instagram, LogOut, User as UserIcon, Award, Trophy, Users, BarChart, MessageSquare, Star, ArrowUp, ArrowDown, GripVertical, ChevronDown, ShieldCheck, AlertTriangle, ShieldX, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PortfolioView } from "./portfolio-view";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getUserById, getExperiencesByUserId, getCurrentUser } from "@/lib/database";
import { logout as performLogout } from "@/app/auth/actions";
import type { User, PortfolioItem, Experience } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { analyzeUserBehavior, CommunityPolicingOutput } from "@/ai/flows/community-policing-agent";


type ProfileData = {
    name: string;
    headline: string;
    bio: string;
}

type SocialLinks = {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
}

type ProfileSection = 'about' | 'skills' | 'community' | 'achievements' | 'network' | 'impact' | 'recommendations';

const sectionComponents: Record<ProfileSection, React.FC<any>> = {
    about: AboutCard,
    skills: SkillsCard,
    community: CommunityStandingCard,
    achievements: AchievementsCard,
    network: NetworkInsightsCard,
    impact: ImpactMetricsCard,
    recommendations: RecommendationsCard,
};

const sectionTitles: Record<ProfileSection, string> = {
    about: 'About',
    skills: 'Skills',
    community: 'Community Standing',
    achievements: 'Achievements',
    network: 'Network Insights',
    impact: 'Impact Metrics',
    recommendations: 'Recommendations',
};

interface ProfileClientProps {
    initialUser: User;
    initialExperiences: Experience[];
    currentUser: User | null;
}

export function ProfileClient({ initialUser, initialExperiences, currentUser }: ProfileClientProps) {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<User>(initialUser);
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const isMyProfile = params.id === 'me' || (currentUser?.id === user.id);
  
  const [sections, setSections] = useState<ProfileSection[]>(['about', 'community', 'skills', 'achievements', 'network', 'impact', 'recommendations']);

  const [socials, setSocials] = useState<SocialLinks>({
    twitter: "https://x.com/sentry",
    linkedin: "https://linkedin.com/in/sentry",
    instagram: "",
  });

  const handleSaveProfile = (updatedProfile: ProfileData) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedProfile } : null);
    // Here you would typically make an API call to save the changes
  };

  const handleSaveExperience = (updatedExperiences: Experience[]) => {
    setExperiences(updatedExperiences);
    // Here you would typically make an API call to save the changes
  };

  const handleSaveSkills = (updatedSkills: string[]) => {
     setUser(prevUser => prevUser ? { ...prevUser, skills: updatedSkills } : null);
  };
  
  const handleSaveAvatar = (newUrl: string) => {
      setUser(prevUser => prevUser ? { ...prevUser, avatar: newUrl } : null);
  }

  const handleSaveCoverImage = (newUrl: string) => {
      setUser(prevUser => prevUser ? { ...prevUser, coverImage: newUrl } : null);
  }
  
  const handleSaveSocials = (updatedSocials: SocialLinks) => {
      setSocials(updatedSocials);
  };

  const overviewCardProps = {
    user,
    skills: user.skills || [],
    isMyProfile,
    handleSaveSkills,
  };


  return (
    <div className="bg-muted/40">
      {/* Profile Header */}
      <Card className="rounded-none relative">
        <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
                <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl font-bold md:text-3xl">{user.name}</h1>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-80">
                        <DropdownMenuLabel>About {user.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="focus:bg-transparent cursor-default">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-semibold">{user.headline}</p>
                              <p className="text-muted-foreground line-clamp-3">{user.bio}</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-muted-foreground">{user.headline}</p>
                </div>
                <div className="mt-4 flex w-full flex-col items-center sm:items-end gap-4 sm:w-auto">
                    <div className="flex items-center gap-2">
                        {socials.twitter && (
                            <Button asChild variant="outline" size="icon" className="rounded-full h-8 w-8">
                                <a href={socials.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a>
                            </Button>
                        )}
                        {socials.linkedin && (
                            <Button asChild variant="outline" size="icon" className="rounded-full h-8 w-8">
                                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /></a>
                            </Button>
                        )}
                        {socials.instagram && (
                            <Button asChild variant="outline" size="icon" className="rounded-full h-8 w-8">
                                <a href={socials.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="h-4 w-4" /></a>
                            </Button>
                        )}
                    </div>
                    <div className="flex w-full flex-shrink-0 flex-col sm:flex-row gap-2 sm:w-auto">
                        {isMyProfile ? (
                             <EditProfileDialog
                                initialProfile={{ name: user.name, headline: user.headline, bio: user.bio }}
                                onSave={handleSaveProfile}
                                initialSocials={socials}
                                onSaveSocials={handleSaveSocials}
                            />
                        ) : (
                            <>
                                <Button className="flex-1">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Connect
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <Mail className="mr-2 h-4 w-4" /> Message
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
      
      {/* Content Tabs */}
       <div className="p-4 sm:p-6 md:p-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto bg-black text-muted-foreground">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList>
              
              <div className="max-w-4xl mx-auto mt-6">
                <TabsContent value="overview">
                    <div className="space-y-8">
                        {isMyProfile && (
                            <div className="flex justify-end">
                                <EditSectionsDialog sections={sections} onSave={setSections} />
                            </div>
                        )}
                        {sections.map(sectionId => {
                           const Component = sectionComponents[sectionId];
                           return <Component key={sectionId} {...overviewCardProps} />
                        })}
                    </div>
                </TabsContent>
                
                <TabsContent value="experience">
                   <div className="relative">
                        <div className="absolute left-9 top-0 w-px h-full bg-border -translate-x-1/2"></div>
                         <div className="space-y-12">
                            {experiences.map((exp, index) => (
                                <div key={index} className="relative flex items-start gap-8">
                                    <div className="absolute left-9 top-2 h-4 w-4 bg-background border-2 border-primary rounded-full -translate-x-1/2"></div>
                                    <div className="pt-1.5 hidden md:block">
                                        <Briefcase className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <Card className="flex-1">
                                        <CardHeader>
                                            <CardTitle className="text-xl">{exp.title}</CardTitle>
                                             {isMyProfile && index === 0 && (
                                                <EditExperienceDialog initialExperiences={experiences} onSave={handleSaveExperience} />
                                            )}
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
                                                <div className="flex items-center gap-2"><Building className="h-4 w-4" /><span>{exp.company}</span></div>
                                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{exp.duration}</span></div>
                                            </div>
                                            <p>{exp.description || 'This is a placeholder description for the role. In the future, users will be able to add detailed descriptions, achievements, and link relevant portfolio projects here.'}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                         </div>
                   </div>
                </TabsContent>

                <TabsContent value="portfolio" className="max-w-none -m-6">
                     <PortfolioView user={user} isMyProfile={isMyProfile} />
                </TabsContent>
              </div>
            </Tabs>
        </div>
    </div>
  );
}

function AboutCard({ user }: { user: User }) {
    if (!user) return null;
    return (
        <Card>
            <CardHeader>
                <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4 rounded-md">
                   <AvatarImage src={user.avatar} alt={user.name} />
                   <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.headline}</p>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-line max-w-2xl mx-auto">{user.bio}</p>
                     <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        {user.jobTitle && user.company && (
                          <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              <span>{user.jobTitle} at {user.company}</span>
                          </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function SkillsCard({ skills, isMyProfile, handleSaveSkills }: { skills: string[], isMyProfile: boolean, handleSaveSkills: (skills: string[]) => void }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills</CardTitle>
                {isMyProfile && <EditSkillsDialog initialSkills={skills} onSave={handleSaveSkills} />}
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {skills.map(skill => <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>)}
            </CardContent>
        </Card>
    );
}

function CommunityStandingCard({ user }: { user: User }) {
    const [analysis, setAnalysis] = useState<CommunityPolicingOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function runAnalysis() {
            setIsLoading(true);
            try {
                // In a real app, this activity and history would be fetched from the DB
                const result = await analyzeUserBehavior({
                    userId: user.id,
                    userActivity: [
                        "Posted a job for 'React Native Developer'",
                        "Commented on 'Best Practices for API Design'",
                        "Completed 'UX for Startups' course",
                        "Posted 'Looking for a UI/UX Designer for a short-term project'"
                    ],
                    transactionHistory: [
                        { type: 'payment_received', details: 'Project "Logo Redesign" - $500' },
                        { type: 'payment_sent', details: 'Project "Blog Post Writing" - $250' },
                        { type: 'dispute_resolved', details: 'Dispute with Client X resolved amicably.' }
                    ]
                });
                setAnalysis(result);
            } catch (error) {
                console.error("Community analysis failed:", error);
                // Set a default/error state
                setAnalysis({
                    reliabilityScore: user.reliabilityScore || 75,
                    summary: user.communityStanding || 'Could not load community analysis.',
                    flags: user.communityFlags || [],
                });
            } finally {
                setIsLoading(false);
            }
        }

        if (user) {
            runAnalysis();
        }
    }, [user]);

    if (isLoading || !analysis) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Community Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardContent>
            </Card>
        )
    }

    const scoreColor = analysis.reliabilityScore > 80 ? "text-green-600" : analysis.reliabilityScore > 60 ? "text-yellow-600" : "text-red-600";
    const disputeColor = user.disputes === 0 ? "text-green-600" : "text-yellow-600";
    
    const getFlagIcon = (severity: 'low' | 'medium' | 'high') => {
        switch (severity) {
            case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
            default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Community Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Reliability Score</span>
                                    <span className={scoreColor}>{analysis.reliabilityScore}%</span>
                                </div>
                                <Progress value={analysis.reliabilityScore} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{analysis.summary}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {analysis.flags && analysis.flags.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Active Flags</h4>
                        <div className="space-y-2">
                        {analysis.flags.map((flag, index) => (
                             <div key={index} className="flex items-center gap-2 text-sm p-2 rounded-md bg-muted">
                                {getFlagIcon(flag.severity)}
                                <span>{flag.reason}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
                 <div className="flex items-center gap-2 text-sm text-green-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Identity Verified</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Payment Method Verified</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm">
                    <ShieldX className={`h-4 w-4 ${disputeColor}`} />
                    <span className={disputeColor}>
                        Disputes Record: {user.disputes}
                    </span>
                 </div>
            </CardContent>
        </Card>
    )
}

function AchievementsCard({ isMyProfile }: { isMyProfile: boolean }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Achievements</CardTitle>
                {isMyProfile && <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted"><Trophy className="h-6 w-6 text-muted-foreground" /></div>
                    <div>
                        <p className="font-semibold">Top Developer Award 2023</p>
                        <p className="text-sm text-muted-foreground">Awarded for contributions to the open-source community.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted"><Award className="h-6 w-6 text-muted-foreground" /></div>
                    <div>
                        <p className="font-semibold">Certified TypeScript Expert</p>
                        <p className="text-sm text-muted-foreground">Completed an advanced certification for TypeScript.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function NetworkInsightsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Network Insights</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">This section will show network maps and key collaborator endorsements. (Coming Soon)</p>
            </CardContent>
        </Card>
    );
}

function ImpactMetricsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5" /> Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">This section will display quantifiable contributions and impact data. (Coming Soon)</p>
            </CardContent>
        </Card>
    );
}

function RecommendationsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10"><AvatarFallback>AJ</AvatarFallback></Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold">Alice Johnson</p>
                            <div className="flex text-yellow-500"><Star className="h-4 w-4" /><Star className="h-4 w-4" /><Star className="h-4 w-4" /><Star className="h-4 w-4" /><Star className="h-4 w-4" /></div>
                        </div>
                        <p className="text-sm text-muted-foreground italic">"An exceptional developer with a keen eye for detail. A true asset to any team."</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


function EditSocialsDialog({ initialSocials, onSave, triggerButton }: { initialSocials: SocialLinks, onSave: (socials: SocialLinks) => void, triggerButton: React.ReactNode }) {
    const [socials, setSocials] = useState(initialSocials);

    const handleChange = (field: keyof SocialLinks, value: string) => {
        setSocials(prev => ({...prev, [field]: value}));
    };

    const handleSaveChanges = () => {
        onSave(socials);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Social Links</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter / X URL</Label>
                        <Input id="twitter" value={socials.twitter} onChange={(e) => handleChange('twitter', e.target.value)} placeholder="https://x.com/username" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input id="linkedin" value={socials.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} placeholder="https://linkedin.com/in/username" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram URL</Label>
                        <Input id="instagram" value={socials.instagram} onChange={(e) => handleChange('instagram', e.target.value)} placeholder="https://instagram.com/username" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function EditProfileDialog({ 
    initialProfile, 
    onSave,
    initialSocials,
    onSaveSocials,
}: { 
    initialProfile: ProfileData, 
    onSave: (profile: ProfileData) => void,
    initialSocials: SocialLinks,
    onSaveSocials: (socials: SocialLinks) => void,
}) {
    const [profile, setProfile] = useState(initialProfile);

    const handleChange = (field: keyof ProfileData, value: string) => {
        setProfile(prev => ({...prev, [field]: value}));
    }

    const handleSaveChanges = () => {
        onSave(profile);
    }
    
    const handleLogout = async () => {
        await performLogout();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex-1 bg-black hover:bg-gray-800">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={profile.name} onChange={(e) => handleChange('name', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input id="headline" value={profile.headline} onChange={(e) => handleChange('headline', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} className="min-h-32" />
                    </div>
                    <Separator />
                     <EditSocialsDialog
                        initialSocials={initialSocials}
                        onSave={onSaveSocials}
                        triggerButton={<Button variant="outline" className="w-full">Edit Social Links</Button>}
                    />
                </div>
                <DialogFooter className="sm:justify-between">
                    <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
                        </DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function EditSkillsDialog({ initialSkills, onSave }: { initialSkills: string[], onSave: (skills: string[]) => void }) {
    const [skills, setSkills] = useState(initialSkills);
    const [newSkill, setNewSkill] = useState("");

    const handleAddSkill = () => {
        if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleSaveChanges = () => {
        onSave(skills);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Skills</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            value={newSkill} 
                            onChange={(e) => setNewSkill(e.target.value)} 
                            placeholder="Add a new skill"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddSkill();
                                }
                            }}
                        />
                        <Button onClick={handleAddSkill}>Add</Button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {skills.length > 0 ? (
                             <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="text-sm">
                                        {skill}
                                        <button onClick={() => handleRemoveSkill(skill)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center">No skills added yet.</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                     <DialogClose asChild>
                        <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


function EditExperienceDialog({ initialExperiences, onSave }: { initialExperiences: Experience[], onSave: (exps: Experience[]) => void }) {
    const [experiences, setExperiences] = useState(initialExperiences);
    
    const handleAdd = () => {
        setExperiences([...experiences, { title: "", company: "", duration: "", description: "" }]);
    };

    const handleRemove = (index: number) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof Experience, value: string) => {
        const newExperiences = [...experiences];
        const exp = newExperiences[index] as any;
        exp[field] = value;
        setExperiences(newExperiences);
    };

    const handleSaveChanges = () => {
        onSave(experiences);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-4 right-4">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Experience</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                    {experiences.map((exp, index) => (
                        <div key={index} className="space-y-4 rounded-md border p-4 relative">
                            <div className="space-y-2">
                                <Label htmlFor={`title-${index}`}>Job Title</Label>
                                <Input id={`title-${index}`} value={exp.title} onChange={(e) => handleChange(index, 'title', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor={`company-${index}`}>Company</Label>
                                <Input id={`company-${index}`} value={exp.company} onChange={(e) => handleChange(index, 'company', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor={`duration-${index}`}>Duration</Label>                                <Input id={`duration-${index}`} value={exp.duration} onChange={(e) => handleChange(index, 'duration', e.target.value)} />
                            </div>
                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={handleAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Experience
                    </Button>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                     <DialogClose asChild>
                        <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EditImageDialog({ currentImage, onSave, triggerButton }: { currentImage: string, onSave: (newUrl: string) => void, triggerButton: React.ReactNode }) {
    const [imageUrl, setImageUrl] = useState(currentImage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        onSave(imageUrl);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Image</DialogTitle>
                    <DialogDescription>Update your picture by uploading a new file or pasting an image URL.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="w-full aspect-square relative rounded-md overflow-hidden bg-muted">
                        <Image src={imageUrl} alt="Image Preview" fill className="object-cover"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">OR</span>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <Button variant="outline" className="w-full" onClick={handleUploadClick}>
                        Upload from device
                    </Button>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" onClick={handleSave}>Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function EditSectionsDialog({ sections, onSave }: { sections: ProfileSection[], onSave: (sections: ProfileSection[]) => void }) {
    const [orderedSections, setOrderedSections] = useState(sections);

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...orderedSections];
        const [removed] = newSections.splice(index, 1);
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        newSections.splice(newIndex, 0, removed);
        setOrderedSections(newSections);
    };

    const handleSave = () => {
        onSave(orderedSections);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Edit Sections</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Customize Profile Sections</DialogTitle>
                    <DialogDescription>
                        Drag and drop to reorder the sections on your profile overview.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    {orderedSections.map((sectionId, index) => (
                        <div key={sectionId} className="flex items-center justify-between rounded-lg border bg-background p-3">
                            <div className="flex items-center gap-3">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{sectionTitles[sectionId]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveSection(index, 'up')}
                                    disabled={index === 0}
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveSection(index, 'down')}
                                    disabled={index === orderedSections.length - 1}
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" onClick={handleSave}>Save Order</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
