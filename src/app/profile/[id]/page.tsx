
'use client';

import { placeholderUsers, User } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Mail, CheckCircle, MapPin, Link as LinkIcon, Edit, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Experience = {
    title: string;
    company: string;
    duration: string;
};

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const isMyProfile = params.id === 'me';
  const user = isMyProfile ? placeholderUsers[1] : placeholderUsers.find((u) => u.id === params.id);
  
  const initialExperiences: Experience[] = [
    { title: "Senior Frontend Developer", company: "Innovate Inc.", duration: "Jan 2020 - Present · 4+ years" },
    { title: "Web Developer", company: "Solutions Co.", duration: "Jun 2017 - Dec 2019 · 2.5 years" },
  ];

  const [experiences, setExperiences] = useState(initialExperiences);
  const [skills, setSkills] = useState(user?.skills || []);


  if (!user) {
    notFound();
  }

  const handleSaveExperience = (updatedExperiences: Experience[]) => {
    setExperiences(updatedExperiences);
    // Here you would typically make an API call to save the changes
  };

  const handleSaveSkills = (updatedSkills: string[]) => {
    setSkills(updatedSkills);
    // Here you would typically make an API call to save the changes
  };

  return (
    <div className="bg-muted/40">
      {/* Cover Image */}
      <div className="relative h-48 w-full md:h-56">
        <Image
          src={user.coverImage}
          alt={`${user.name}'s cover image`}
          fill
          className="object-cover"
          data-ai-hint="abstract landscape"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Profile Header */}
          <div className="relative -mt-20 flex flex-col items-center gap-4 border-b border-border bg-card p-6 pb-6 sm:flex-row sm:items-end sm:gap-6 md:-mt-24 rounded-t-lg">
            <Avatar className="h-32 w-32 border-4 border-card md:h-36 md:w-36">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-5xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold md:text-3xl">{user.name}</h1>
              <p className="text-muted-foreground">{user.headline}</p>
              <div className="mt-2 flex items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
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
            <div className="mt-4 flex w-full flex-shrink-0 gap-2 sm:mt-0 sm:w-auto">
              <Button className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" /> Connect
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="mr-2 h-4 w-4" /> Message
              </Button>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-8 lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{user.bio}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {user.portfolio.map((item, index) => (
                                <Link href="#" key={index} className="group relative block w-full aspect-video overflow-hidden rounded-lg">
                                    <Image src={item} alt={`Portfolio item ${index+1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint="design abstract" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Right Column */}
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

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Experience</CardTitle>
                        {isMyProfile && (
                            <EditExperienceDialog initialExperiences={experiences} onSave={handleSaveExperience} />
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {experiences.map((exp, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{exp.title}</h3>
                                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                                    <p className="text-xs text-muted-foreground">{exp.duration}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
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
