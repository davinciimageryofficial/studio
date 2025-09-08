
'use client';

import { useState } from "react";
import { User, PortfolioItem } from "@/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Share2, PlusCircle, Settings, LayoutGrid, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PortfolioViewProps {
    user: User;
    isMyProfile: boolean;
}

export function PortfolioView({ user, isMyProfile }: PortfolioViewProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [layout, setLayout] = useState<"grid" | "list">("grid");

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
                    <div className="mb-8 flex flex-col items-center gap-4 md:flex-row">
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
