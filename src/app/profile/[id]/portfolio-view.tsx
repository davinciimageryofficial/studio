
'use client';

import { useState } from "react";
import { User, PortfolioItem } from "@/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Share2, PlusCircle, Settings, LayoutGrid, List, Link as LinkIcon, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface PortfolioViewProps {
    user: User;
    isMyProfile: boolean;
}

const BehanceIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.67981 12.83H2.82981V7.08H7.67981V12.83ZM6.90981 8.2H3.59981V11.71H6.90981V8.2Z" fill="currentColor"/>
        <path d="M11.95 12.83H8.38V7.08H11.95C13.25 7.08 14.1 7.9 14.1 9.42C14.1 10.94 13.25 11.75 11.95 11.75V12.83ZM11.16 8.2H9.15V10.63H11.16C12.44 10.63 13.33 10.22 13.33 9.42C13.33 8.62 12.44 8.2 11.16 8.2Z" fill="currentColor"/>
        <path d="M16.5202 11.66C15.8202 12.36 14.7102 12.83 13.5602 12.83H8.38019V15.71H13.6702C14.8202 15.71 15.6102 15.35 15.6102 14.49C15.6102 14.15 15.4802 13.84 15.2202 13.58L16.5202 11.66Z" fill="currentColor"/>
    </svg>
);
const DribbbleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="currentColor"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M17.8415 4.14563C16.3533 3.32832 14.6183 2.86328 12.7533 2.86328C9.36015 2.86328 6.27364 4.31495 4.22681 6.6438C4.54921 6.74106 4.88773 6.81608 5.24237 6.8687C8.75314 7.42082 11.3789 9.87569 12.146 13.3353C12.7938 13.1258 13.4194 13.0031 14.0732 12.981C16.9234 11.7779 18.9192 9.07185 19.3848 5.79505C18.9192 5.24294 18.4179 4.67269 17.8415 4.14563ZM6.51351 18.4316C4.88773 17.0667 3.73142 15.2269 3.20065 13.1479C5.86214 13.9182 9.05607 13.0789 11.2052 10.9298C10.7039 12.2856 10.4284 13.7476 10.4284 15.2891C10.4284 16.5985 10.7411 17.8355 11.2932 18.9274C9.53995 20.3014 7.82247 20.7303 6.51351 18.4316ZM14.0732 13.9182C13.4715 13.9539 12.879 14.0767 12.3182 14.2861C13.0583 17.516 15.539 20.2442 18.9669 21.1213C19.7842 20.2442 20.4471 19.2219 20.9127 18.0995C17.7831 17.6525 15.1116 15.935 14.0732 13.9182Z" fill="#242424"/>
    </svg>
);
const GitHubIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12C0 17.3 3.438 21.8 8.205 23.385C8.805 23.49 9.025 23.13 9.025 22.815C9.025 22.53 9.015 21.63 9.01 20.415C5.67 21.105 4.965 18.795 4.965 18.795C4.425 17.43 3.63 17.115 3.63 17.115C2.55 16.335 3.705 16.32 3.705 16.32C4.89 16.41 5.55 17.49 5.55 17.49C6.6 19.275 8.28 18.765 8.94 18.48C9.045 17.775 9.315 17.325 9.585 17.085C7.035 16.8 4.38 15.825 4.38 11.265C4.38 9.945 4.86 8.865 5.58 8.04C5.475 7.77 5.115 6.705 5.685 5.25C5.685 5.25 6.66 4.95 8.97 6.45C9.885 6.21 10.86 6.09 11.85 6.09C12.84 6.09 13.815 6.21 14.73 6.45C17.04 4.95 18.015 5.25 18.015 5.25C18.585 6.705 18.225 7.77 18.12 8.04C18.84 8.865 19.32 9.945 19.32 11.265C19.32 15.84 16.665 16.785 14.115 17.07C14.46 17.385 14.79 18.015 14.79 19.005C14.79 20.445 14.775 21.57 14.775 21.885C14.775 22.215 15.000 22.515 15.600 22.395C20.565 20.895 24 16.32 24 12C24 5.37 18.63 0 12 0Z" fill="currentColor"/>
    </svg>
);

function EditExternalLinksDialog({ onSave }: { onSave: (links: Record<string, string>) => void }) {
    const [links, setLinks] = useState({
        behance: "",
        dribbble: "",
        github: "",
    });

    const handleSave = () => {
        onSave(links);
    }
    
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Link External Portfolios</DialogTitle>
                <DialogDescription>Add links to your Behance, Dribbble, or GitHub profiles to showcase more of your work.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="behance-link">Behance Profile URL</Label>
                    <Input id="behance-link" placeholder="https://www.behance.net/username" value={links.behance} onChange={e => setLinks({...links, behance: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dribbble-link">Dribbble Profile URL</Label>
                    <Input id="dribbble-link" placeholder="https://dribbble.com/username" value={links.dribbble} onChange={e => setLinks({...links, dribbble: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="github-link">GitHub Profile URL</Label>
                    <Input id="github-link" placeholder="https://github.com/username" value={links.github} onChange={e => setLinks({...links, github: e.target.value})} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                <DialogClose asChild><Button onClick={handleSave}>Save Links</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}

export function PortfolioView({ user, isMyProfile }: PortfolioViewProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [layout, setLayout] = useState<"grid" | "list">("grid");
    const [externalLinks, setExternalLinks] = useState({
        behance: "https://www.behance.net/username",
        dribbble: "",
        github: "https://github.com/username",
    });

    const filteredPortfolio = user.portfolio.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return (
        <div className="bg-background min-h-screen">
            <header className="sticky top-0 z-10 border-b bg-background/80 p-4 backdrop-blur-lg">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">{user.name}'s Portfolio</h2>
                    <div className="flex items-center gap-2">
                         {isMyProfile && (
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Manage Links
                                    </Button>
                                </DialogTrigger>
                                <EditExternalLinksDialog onSave={setExternalLinks} />
                            </Dialog>
                        )}
                        <Button variant="outline" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Portfolio
                        </Button>
                         {isMyProfile && (
                            <Button size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Project
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="p-4 sm:p-6 md:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col items-start gap-4">
                         <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                            <div className="relative w-full flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search projects..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">Layout:</p>
                                <Button
                                    variant={layout === 'grid' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    onClick={() => setLayout('grid')}
                                >
                                    <LayoutGrid className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant={layout === 'list' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    onClick={() => setLayout('list')}
                                >
                                    <List className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            {externalLinks.behance && (
                                <Button asChild variant="outline" size="sm">
                                    <a href={externalLinks.behance} target="_blank" rel="noopener noreferrer"><BehanceIcon /> <span className="ml-2">Behance</span></a>
                                </Button>
                            )}
                            {externalLinks.dribbble && (
                                <Button asChild variant="outline" size="sm">
                                    <a href={externalLinks.dribbble} target="_blank" rel="noopener noreferrer"><DribbbleIcon /> <span className="ml-2">Dribbble</span></a>
                                </Button>
                            )}
                             {externalLinks.github && (
                                <Button asChild variant="outline" size="sm">
                                    <a href={externalLinks.github} target="_blank" rel="noopener noreferrer"><GitHubIcon /> <span className="ml-2">GitHub</span></a>
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    {filteredPortfolio.length > 0 ? (
                        <div className={cn(
                            "grid gap-8",
                            layout === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                        )}>
                            {filteredPortfolio.map((item, index) => (
                                <PortfolioCard key={index} item={item} layout={layout} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 py-24 text-center">
                            <h3 className="text-xl font-semibold">No Projects Found</h3>
                            <p className="mt-2 text-muted-foreground">
                                No projects match your search term. Try another query.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

function PortfolioCard({ item, layout }: { item: PortfolioItem, layout: 'grid' | 'list' }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                 <Card className={cn("overflow-hidden group transition-all hover:shadow-xl cursor-pointer", layout === 'list' && "md:grid md:grid-cols-3 md:gap-0")}>
                    <div className={cn("relative overflow-hidden", layout === 'grid' ? "aspect-video" : "md:aspect-video aspect-video")}>
                        <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint="design abstract"
                        />
                    </div>
                    <div className={cn("p-4 md:p-6 flex flex-col", layout === 'list' && "md:col-span-2")}>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2 flex-grow">{item.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {item.tags.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative aspect-video">
                         <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover rounded-l-lg"
                        />
                    </div>
                    <div className="flex flex-col p-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{item.title}</DialogTitle>
                        </DialogHeader>
                        <p className="mt-4 text-muted-foreground flex-grow">{item.description}</p>
                        <div className="mt-6">
                             <h4 className="font-semibold mb-2">Technologies & Skills</h4>
                             <div className="flex flex-wrap gap-2">
                                {item.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                         <div className="mt-6 flex gap-2">
                            <Button className="w-full">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Project
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
