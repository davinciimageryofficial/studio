
'use client';

import { placeholderUsers, User } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Mail, CheckCircle, MapPin, Link as LinkIcon, Edit, Plus, Trash2, X, Building, Calendar, Twitter, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type Experience = {
    title: string;
    company: string;
    duration: string;
};

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

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const isMyProfile = params.id === 'me';
  const initialUser = isMyProfile ? placeholderUsers[1] : placeholderUsers.find((u) => u.id === params.id);
  
  const [user, setUser] = useState(initialUser);

  const initialExperiences: Experience[] = [
    { title: "Senior Frontend Developer", company: "Innovate Inc.", duration: "Jan 2020 - Present · 4+ years" },
    { title: "Web Developer", company: "Solutions Co.", duration: "Jun 2017 - Dec 2019 · 2.5 years" },
  ];

  const [experiences, setExperiences] = useState(initialExperiences);
  const [skills, setSkills] = useState(user?.skills || []);
  const [socials, setSocials] = useState<SocialLinks>({
    twitter: "https://x.com/sentry",
    linkedin: "https://linkedin.com/in/sentry",
    instagram: "",
  });


  if (!user) {
    notFound();
  }
  
  const handleSaveProfile = (updatedProfile: ProfileData) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedProfile } : null);
    // Here you would typically make an API call to save the changes
  };

  const handleSaveExperience = (updatedExperiences: Experience[]) => {
    setExperiences(updatedExperiences);
    // Here you would typically make an API call to save the changes
  };

  const handleSaveSkills = (updatedSkills: string[]) => {
    setSkills(updatedSkills);
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


  return (
    <div className="bg-muted/40 min-h-screen">
      {/* Profile Header */}
      <Card className="rounded-none relative">
        <div className="relative h-40 w-full md:h-48 group">
            <Image
              src={user.coverImage}
              alt={`${user.name}'s cover image`}
              fill
              className="object-cover"
              data-ai-hint="abstract landscape"
            />
            {isMyProfile && (
                 <EditImageDialog
                    currentImage={user.coverImage}
                    onSave={handleSaveCoverImage}
                    triggerButton={
                        <Button variant="outline" size="sm" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Cover
                        </Button>
                    }
                />
            )}
        </div>
        <CardContent className="p-4 py-16 sm:p-6 sm:py-16">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:gap-6 -mt-28 sm:-mt-24">
                <div className="relative group flex-shrink-0">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-card">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-5xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                     {isMyProfile && (
                        <EditImageDialog
                            currentImage={user.avatar}
                            onSave={handleSaveAvatar}
                            triggerButton={
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Edit className="h-6 w-6 text-white" />
                                </div>
                            }
                        />
                    )}
                </div>
                <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
                  <h1 className="text-2xl font-bold md:text-3xl">{user.name}</h1>
                  <p className="text-muted-foreground">{user.headline}</p>
                  <div className="mt-2 flex items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>San Francisco, CA</span>
                      </div>
                       <div className="flex items-center gap-1">
                          <LinkIcon className="h-4 w-4" />
                          <a href="#" className="hover:underline">website.com</a>
                      </div>
                  </div>
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
                    <div className="flex w-full flex-shrink-0 gap-2 sm:w-auto">
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
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList>
              
              <div className="max-w-4xl mx-auto mt-6">
                <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardHeader><CardTitle>About</CardTitle></CardHeader>
                                <CardContent><p className="text-muted-foreground whitespace-pre-line">{user.bio}</p></CardContent>
                            </Card>
                        </div>
                        <div className="space-y-8">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Skills</CardTitle>
                                    {isMyProfile && (
                                        <EditSkillsDialog initialSkills={skills} onSave={handleSaveSkills} />
                                    )}
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
                
                <TabsContent value="experience">
                   <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Work Experience</CardTitle>
                            {isMyProfile && (
                                <EditExperienceDialog initialExperiences={experiences} onSave={handleSaveExperience} />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="relative pl-6">
                                <div className="absolute left-6 top-0 bottom-0 w-px bg-border"></div>
                                {experiences.map((exp, index) => (
                                    <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
                                        <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary"></div>
                                        <div>
                                            <h3 className="font-semibold">{exp.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                <div className="flex items-center gap-1.5"><Building className="h-4 w-4" /> <span>{exp.company}</span></div>
                                                <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> <span>{exp.duration}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="portfolio">
                     <Card>
                        <CardHeader><CardTitle>Portfolio</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {user.portfolio.map((item, index) => (
                                    <Link href="#" key={index} className="group relative block w-full aspect-video overflow-hidden rounded-lg">
                                        <Image src={item} alt={`Portfolio item ${index+1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint="design abstract" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
              </div>
            </Tabs>
        </div>
    </div>
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

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
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
        setExperiences([...experiences, { title: "", company: "", duration: "" }]);
    };

    const handleRemove = (index: number) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof Experience, value: string) => {
        const newExperiences = [...experiences];
        newExperiences[index][field] = value;
        setExperiences(newExperiences);
    };

    const handleSaveChanges = () => {
        onSave(experiences);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
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
