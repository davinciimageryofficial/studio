
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { placeholderNews } from "@/lib/placeholder-data";
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
  | "Spotlight";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const getArticlesForCategory = (category: Category) => {
    switch (category) {
      case "All":
        return placeholderNews;
      case "Personalized": // Placeholder for personalized content
        return placeholderNews.slice(2,6);
      case "Trending":
        return placeholderNews.slice(0, 4); // Placeholder for trending
      default:
        return placeholderNews.filter(
          (article) => article.category.toLowerCase() === category.toLowerCase()
        );
    }
  };
  
  const categories: Category[] = ["Tech", "Design", "Writing", "Development", "Freelance", "AI & Machine Learning", "Cybersecurity", "Data Science", "Cloud Computing", "UI/UX"];
  const isCategorySelected = categories.includes(selectedCategory);


  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold tracking-tighter">SENTRY News</h1>
        <p className="mt-1 text-muted-foreground">
          The latest in tech, creative industries, and the future of work.
        </p>
      </header>

      <div className="mb-8 flex justify-center">
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted p-1 w-fit">
          <Button 
            variant={selectedCategory === 'Personalized' ? 'default' : 'ghost'} 
            onClick={() => setSelectedCategory('Personalized')}
            className={cn(selectedCategory === 'Personalized' && "shadow-sm", "text-muted-foreground data-[state=active]:text-foreground")}
          >
            Personalized
          </Button>
          <Button 
            variant={selectedCategory === 'Trending' ? 'default' : 'ghost'} 
            onClick={() => setSelectedCategory('Trending')}
            className={cn(selectedCategory === 'Trending' && "shadow-sm", "text-muted-foreground data-[state=active]:text-foreground")}
          >
            Trending
          </Button>
           <Button 
            variant={selectedCategory === 'Events' ? 'default' : 'ghost'} 
            onClick={() => setSelectedCategory('Events')}
            className={cn(selectedCategory === 'Events' && "shadow-sm", "text-muted-foreground data-[state=active]:text-foreground")}
          >
            Events
          </Button>
           <Button 
            variant={selectedCategory === 'Platforms' ? 'default' : 'ghost'} 
            onClick={() => setSelectedCategory('Platforms')}
            className={cn(selectedCategory === 'Platforms' && "shadow-sm", "text-muted-foreground data-[state=active]:text-foreground")}
          >
            Platforms
          </Button>
           <Button 
            variant={selectedCategory === 'Spotlight' ? 'default' : 'ghost'} 
            onClick={() => setSelectedCategory('Spotlight')}
            className={cn(selectedCategory === 'Spotlight' && "shadow-sm", "text-muted-foreground data-[state=active]:text-foreground")}
          >
            Spotlight
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={isCategorySelected ? 'default' : 'ghost'}
                className={cn(isCategorySelected && "shadow-sm", "text-muted-foreground data-[state=active]:text-foreground")}
              >
                {isCategorySelected ? selectedCategory : 'Select Category'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Topics</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuItem key={category} onSelect={() => setSelectedCategory(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <NewsGrid articles={getArticlesForCategory(selectedCategory)} />
    </div>
  );
}

function NewsGrid({ articles }: { articles: typeof placeholderNews }) {
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
                src={featured.imageUrl}
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
                        src={article.imageUrl}
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
