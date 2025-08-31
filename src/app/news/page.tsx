import Link from "next/link";
import Image from "next/image";
import { placeholderNews } from "@/lib/placeholder-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewsPage() {
  const featuredArticle = placeholderNews[0];
  const otherArticles = placeholderNews.slice(1);
  const categories = ["All", "Trending", "Tech", "Design", "Writing", "Freelance"];

  const getArticlesForCategory = (category: string) => {
    if (category === "All") return placeholderNews;
    if (category === "Trending") return placeholderNews.slice(0, 4); // Placeholder for trending
    return placeholderNews.filter(
      (article) => article.category.toLowerCase() === category.toLowerCase()
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold tracking-tighter">SENTRY News</h1>
        <p className="mt-1 text-muted-foreground">
          The latest in tech, creative industries, and the future of work.
        </p>
      </header>

      <Tabs defaultValue="All" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3 sm:w-auto sm:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <NewsGrid articles={getArticlesForCategory(category)} />
          </TabsContent>
        ))}
      </Tabs>
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