
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatisticsView } from "./statistics";
import { ClientOnly } from "@/components/layout/client-only";
import { getNews } from "@/lib/database";
import { Skeleton } from "@/components/ui/skeleton";

type Article = {
  id: number;
  created_at: string;
  title: string;
  excerpt: string;
  image_url: string;
  author: string;
  category: string;
  date: string;
};

type Category = 
  | "All" 
  | "Personalized" 
  | "Trending" 
  | "Tech" 
  | "Design" 
  | "Writing" 
  | "Freelance"
  | "AI & Machine Learning"
  | "Cybersecurity"
  | "Data Science"
  | "Development"
  | "Cloud Computing"
  | "UI/UX"
  | "Events"
  | "Platforms"
  | "Spotlight"
  | "Statistics";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
        setIsLoading(true);
        const newsArticles = await getNews();
        setArticles(newsArticles);
        setIsLoading(false);
    }
    loadNews();
  }, []);

  const getArticlesForCategory = (category: Category) => {
    switch (category) {
      case "All":
        return articles;
      case "Personalized": // Placeholder for personalized content
        return articles.slice(2,6);
      case "Trending":
        return articles.slice(0, 4); // Placeholder for trending
      case "Statistics":
        return []; // This tab has its own component
      default:
        return articles.filter(
          (article) => article.category.toLowerCase() === category.toLowerCase()
        );
    }
  };
  
  const mainCategories: Category[] = ["Personalized", "Trending", "Statistics", "Events", "Platforms"];
  const dropdownCategories: Category[] = ["Tech", "Design", "Writing", "Development", "Freelance", "AI & Machine Learning", "Cybersecurity", "Data Science", "Cloud Computing", "UI/UX"];
  const allCategories: Category[] = ["All", ...mainCategories, ...dropdownCategories];
  const isDropdownCategorySelected = dropdownCategories.includes(selectedCategory);


  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl tracking-tighter font-headline-tech font-bold">SENTRY NEWS</h1>
        <p className="mt-1 text-muted-foreground">
          The latest in tech, creative industries, and the future of work.
        </p>
      </header>

      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category)} className="w-full">
        <div className="mb-8">
            <TabsList className="grid w-full grid-cols-6 bg-black text-muted-foreground/80">
                {mainCategories.map(category => (
                    <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                ))}
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <TabsTrigger value={isDropdownCategorySelected ? selectedCategory : "more"} className={cn(isDropdownCategorySelected && "bg-background text-foreground shadow-sm")}>
                            {isDropdownCategorySelected ? selectedCategory : "More"}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </TabsTrigger>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Topics</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {dropdownCategories.map((category) => (
                            <DropdownMenuItem key={category} onSelect={() => setSelectedCategory(category)}>
                            {category}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </TabsList>
        </div>
        
        {allCategories.map(category => (
          <TabsContent key={category} value={category} forceMount={['Statistics'].includes(category)}>
            {category === 'Statistics' ? (
              <StatisticsView />
            ) : isLoading ? (
                <NewsGridSkeleton />
            ) : (
              <NewsGrid articles={getArticlesForCategory(category)} />
            )}
          </TabsContent>
        ))}

      </Tabs>
    </div>
  );
}

function NewsGridSkeleton() {
    return (
         <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <CardContent className="p-6 space-y-3">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-5/6" />
                        <Skeleton className="h-4 w-1/2 pt-2" />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <Skeleton className="aspect-square w-full rounded-lg" />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
         </div>
    )
}

function NewsGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return <p className="text-center text-muted-foreground">No articles found in this category.</p>;
  }

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      {/* Featured Article */}
      <div className="lg:col-span-2">
        <Link href="#" className="group block">
          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={featured.image_url}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="abstract tech"
              />
            </div>
            <CardContent className="p-6">
              <Badge variant="default" className="mb-2">{featured.category}</Badge>
              <h2 className="text-2xl font-bold leading-tight group-hover:underline xl:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-2 text-muted-foreground">{featured.excerpt}</p>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                By {featured.author} · {featured.date}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Sidebar Articles */}
      <div className="space-y-8">
        {rest.map((article) => (
          <Link key={article.id} href="#" className="group block">
             <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <div className="aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        width={150}
                        height={150}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="minimalist abstract"
                      />
                  </div>
                </div>
                 <div className="col-span-2">
                  <Badge variant="secondary" className="mb-1">{article.category}</Badge>
                  <h3 className="font-semibold leading-snug group-hover:underline">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {article.author} · {article.date}
                  </p>
                 </div>
             </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
