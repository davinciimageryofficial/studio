
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientOnly } from "@/components/layout/client-only";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { generateCourse, type CourseGeneratorOutput } from "@/ai/flows/course-generator";
import { Skeleton } from "@/components/ui/skeleton";

function CoursesPageInternal() {
  const [courses, setCourses] = useState<CourseGeneratorOutput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState("relevance");
  const [skillLevel, setSkillLevel] = useState("all");

  const courseCategories = ['Development', 'Design', 'Writing', 'AI & Machine Learning', 'Data Science', 'Freelance'];

  useEffect(() => {
    async function fetchCourses() {
      setIsLoading(true);
      try {
        const coursePromises = courseCategories.flatMap(cat => 
            Array.from({ length: 2 }).map(() => generateCourse({ category: cat as any }))
        );
        const generatedCourses = await Promise.all(coursePromises);
        setCourses(generatedCourses);
      } catch (error) {
        console.error("Failed to generate courses:", error);
        // Optionally, set an error state to show in the UI
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourses();
  }, []);


  const filteredAndSortedCourses = courses
    .filter(course => {
      const matchesCategory = category === 'all' || course.category.toLowerCase() === category.toLowerCase();
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
      const matchesLevel = skillLevel === 'all' || course.level.toLowerCase() === skillLevel.toLowerCase();
      return matchesCategory && matchesSearch && matchesPrice && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          // Assuming higher ID is newer, will need a real date field for production
          return (parseInt(b.id.split('-')[1]) || 0) - (parseInt(a.id.split('-')[1]) || 0);
        default:
          return 0; // 'relevance' - no specific sorting for now
      }
    });

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline-tech uppercase">COURSES</h1>
        <p className="mt-1 text-muted-foreground">
          Level up your skills with courses from industry experts.
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
              {courseCategories.map(cat => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Collapsible className="mb-6">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 rounded-md border p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <Label htmlFor="price-range">Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
                  <Slider
                    id="price-range"
                    min={0}
                    max={300}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>
                <div>
                   <Label htmlFor="sort-by">Sort by</Label>
                   <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort-by" className="w-full mt-2">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                   <Label htmlFor="skill-level">Skill Level</Label>
                   <Select value={skillLevel} onValueChange={setSkillLevel}>
                    <SelectTrigger id="skill-level" className="w-full mt-2">
                      <SelectValue placeholder="Skill Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>
        </CollapsibleContent>
      </Collapsible>


      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => <CourseCardSkeleton key={index} />)
        ) : filteredAndSortedCourses.length > 0 ? (
            filteredAndSortedCourses.map((course) => (
                <ContentCard key={course.id} content={course} />
            ))
        ) : (
            <p className="text-muted-foreground col-span-full text-center">No courses found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
    return (
        <ClientOnly>
            <CoursesPageInternal />
        </ClientOnly>
    )
}

function ContentCard({ content }: { content: CourseGeneratorOutput }) {
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
             <Badge className="absolute top-3 right-3">{content.category}</Badge>
             <Badge variant="secondary" className="absolute top-3 left-3">{content.level}</Badge>
        </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{content.title}</h3>
        <p className="text-sm text-muted-foreground">By {content.author}</p>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{content.description}</p>
        <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-bold">
                ${content.price.toFixed(2)}
            </p>
            <Button variant="outline" size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Purchase
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CourseCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-8 w-1/4" />
                </div>
            </CardContent>
        </Card>
    )
}
