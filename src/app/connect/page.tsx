
"use client";

import { useState } from "react";
import Image from "next/image";
import { placeholderCourses, placeholderPodcasts } from "@/lib/placeholder-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShoppingCart, PlayCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function PodcastsAndCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const allCategories = [
    ...new Set([
      ...placeholderCourses.map(c => c.category),
      ...placeholderPodcasts.map(p => p.category)
    ])
  ];

  const filterContent = (content: any[]) => {
    return content.filter(item => {
      const matchesCategory = category === 'all' || item.category.toLowerCase() === category.toLowerCase();
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const filteredCourses = filterContent(placeholderCourses);
  const filteredPodcasts = filterContent(placeholderPodcasts);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Podcasts & Courses</h1>
        <p className="mt-1 text-muted-foreground">
          Level up your skills with content from industry experts.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or author..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map(cat => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>


      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
        </TabsList>
        <TabsContent value="courses">
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                    <ContentCard key={course.id} content={course} type="course" />
                ))
            ) : (
                <p className="text-muted-foreground col-span-full text-center">No courses found.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="podcasts">
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {filteredPodcasts.length > 0 ? (
                filteredPodcasts.map((podcast) => (
                    <ContentCard key={podcast.id} content={podcast} type="podcast" />
                ))
             ) : (
                <p className="text-muted-foreground col-span-full text-center">No podcasts found.</p>
             )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentCard({ content, type }: { content: any; type: "course" | "podcast" }) {
  const isCourse = type === 'course';
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-video">
            <Image
            src={content.imageUrl}
            alt={content.title}
            fill
            className="object-cover"
            data-ai-hint="abstract design"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             <Badge className="absolute top-3 right-3" variant={isCourse ? 'default' : 'secondary'}>{content.category}</Badge>
        </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{content.title}</h3>
        <p className="text-sm text-muted-foreground">By {content.author}</p>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{content.description}</p>
        <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-bold">
                {isCourse ? `$${content.price}` : "Free"}
            </p>
            <Button variant="outline" size="sm">
                {isCourse ? <ShoppingCart className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                {isCourse ? "Purchase" : "Listen"}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
