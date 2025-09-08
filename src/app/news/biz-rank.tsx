
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, LayoutGrid, Search, ArrowUp, ArrowDown, ExternalLink, Mail, Building } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";

const bizRankData = [
  { rank: 1, name: "Innovate Inc.", niche: "Web Development", score: 98.5, description: "Leading the charge in cutting-edge web solutions and custom software.", logo: "https://picsum.photos/seed/biz1/200", website: "#", contact: "contact@innovate.com" },
  { rank: 2, name: "Creative Co.", niche: "UI/UX Design", score: 97.2, description: "Crafting beautiful, intuitive, and user-centric digital experiences.", logo: "https://picsum.photos/seed/biz2/200", website: "#", contact: "hello@creative.co" },
  { rank: 3, name: "Data Insights", niche: "Data Science", score: 96.8, description: "Unlocking the power of data with advanced analytics and machine learning.", logo: "https://picsum.photos/seed/biz3/200", website: "#", contact: "info@datainsights.ai" },
  { rank: 4, name: "Future Labs", niche: "Web Development", score: 95.1, description: "Building the next generation of web applications with a focus on performance.", logo: "https://picsum.photos/seed/biz4/200", website: "#", contact: "contact@futurelabs.dev" },
  { rank: 5, name: "Pixel Perfect", niche: "UI/UX Design", score: 94.9, description: "Where pixel-perfect design meets flawless user experience.", logo: "https://picsum.photos/seed/biz5/200", website: "#", contact: "projects@pixelperfect.design" },
  { rank: 6, name: "Content Kings", niche: "SEO & Writing", score: 94.5, description: "Driving organic growth through strategic content and SEO mastery.", logo: "https://picsum.photos/seed/biz6/200", website: "#", contact: "team@contentkings.com" },
  { rank: 7, name: "Cloud Solutions", niche: "Web Development", score: 93.8, description: "Scalable and secure cloud infrastructure for modern businesses.", logo: "https://picsum.photos/seed/biz7/200", website: "#", contact: "sales@cloudsolutions.io" },
  { rank: 8, name: "Neural Networks", niche: "Data Science", score: 92.5, description: "Pioneering advancements in neural networks and artificial intelligence.", logo: "https://picsum.photos/seed/biz8/200", website: "#", contact: "contact@neural.net" },
  { rank: 9, name: "StoryWeavers", niche: "SEO & Writing", score: 91.9, description: "Weaving compelling narratives that captivate audiences and build brands.", logo: "https://picsum.photos/seed/biz9/200", website: "#", contact: "inquiries@storyweavers.co" },
  { rank: 10, name: "Design Sparks", niche: "UI/UX Design", score: 91.2, description: "Igniting brands with creative sparks and innovative design solutions.", logo: "https://picsum.photos/seed/biz10/200", website: "#", contact: "start@designsparks.com" },
];

type BizData = typeof bizRankData[0];
const niches = ["All", ...new Set(bizRankData.map(b => b.niche))];

export function BizRankView() {
  const [selectedNiche, setSelectedNiche] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"rank_asc" | "name_asc">("rank_asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredAndSortedBusinesses = bizRankData
    .filter(biz => 
      (selectedNiche === "All" || biz.niche === selectedNiche) &&
      (biz.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === "name_asc") {
        return a.name.localeCompare(b.name);
      }
      return a.rank - b.rank; // rank_asc
    });

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Top Businesses by Niche (Biz-Rank)</CardTitle>
          <CardDescription>An interactive catalogue of the top businesses on the platform, filterable and sortable.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search businesses..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select a niche" />
                </SelectTrigger>
                <SelectContent>
                  {niches.map(niche => (
                    <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rank_asc">Sort by Rank</SelectItem>
                  <SelectItem value="name_asc">Sort by Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
               <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                  <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><LayoutGrid className="h-5 w-5" /></Button>
                  <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List className="h-5 w-5" /></Button>
              </div>
            </div>
          </div>
          
          {viewMode === 'list' ? (
            <BusinessTable businesses={filteredAndSortedBusinesses} />
          ) : (
            <BusinessGrid businesses={filteredAndSortedBusinesses} />
          )}

        </CardContent>
      </Card>
    </div>
  );
}

function BusinessTable({ businesses }: { businesses: BizData[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Niche</TableHead>
                    <TableHead className="text-right">Biz-Rank Score</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {businesses.map(biz => (
                    <Dialog key={biz.rank}>
                        <DialogTrigger asChild>
                            <TableRow className="cursor-pointer">
                                <TableCell className="font-bold">{biz.rank}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-10 flex-shrink-0">
                                            <Image src={biz.logo} alt={`${biz.name} logo`} fill className="rounded-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{biz.name}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-xs">{biz.description}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant="secondary">{biz.niche}</Badge></TableCell>
                                <TableCell className="text-right font-medium">{biz.score.toFixed(1)}</TableCell>
                            </TableRow>
                        </DialogTrigger>
                        <BusinessDialogContent business={biz} />
                    </Dialog>
                ))}
            </TableBody>
        </Table>
    );
}

function BusinessGrid({ businesses }: { businesses: BizData[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map(biz => (
                 <Dialog key={biz.rank}>
                    <DialogTrigger asChild>
                        <Card className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="relative h-12 w-12 flex-shrink-0">
                                    <Image src={biz.logo} alt={`${biz.name} logo`} fill className="rounded-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{biz.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{biz.niche}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{biz.description}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-bold">Rank: {biz.rank}</span>
                                    <span className="font-semibold text-primary">Score: {biz.score.toFixed(1)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </DialogTrigger>
                    <BusinessDialogContent business={biz} />
                </Dialog>
            ))}
        </div>
    );
}

function BusinessDialogContent({ business }: { business: BizData }) {
    return (
        <DialogContent className="sm:max-w-lg">
            <DialogHeader className="text-center items-center">
                <div className="relative h-20 w-20 mb-4">
                    <Image src={business.logo} alt={`${business.name} logo`} fill className="rounded-full object-cover" />
                </div>
                <DialogTitle className="text-2xl">{business.name}</DialogTitle>
                <Badge variant="outline" className="w-fit">{business.niche}</Badge>
            </DialogHeader>
            <div className="py-4 px-2 space-y-6">
                <p className="text-center text-muted-foreground">{business.description}</p>
                 <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="rounded-lg border p-3">
                        <p className="text-sm text-muted-foreground">Rank</p>
                        <p className="text-2xl font-bold">{business.rank}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-sm text-muted-foreground">Biz-Rank Score</p>
                        <p className="text-2xl font-bold text-primary">{business.score.toFixed(1)}</p>
                    </div>
                </div>
                 <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild className="flex-1">
                        <a href={business.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Visit Website
                        </a>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                        <a href={`mailto:${business.contact}`}>
                           <Mail className="mr-2 h-4 w-4" /> Contact Business
                        </a>
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}
