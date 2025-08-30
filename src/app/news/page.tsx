import Link from "next/link";
import Image from "next/image";
import { placeholderNews } from "@/lib/placeholder-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NewsPage() {
  const featuredArticle = placeholderNews[0];
  const otherArticles = placeholderNews.slice(1);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold tracking-tighter">SENTRY News</h1>
        <p className="mt-1 text-muted-foreground">
          The latest in tech, creative industries, and the future of work.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Featured Article */}
        <div className="lg:col-span-2">
          <Link href="#" className="group block">
            <Card className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint="abstract tech"
                />
              </div>
              <CardContent className="p-6">
                <Badge variant="default" className="mb-2">{featuredArticle.category}</Badge>
                <h2 className="text-2xl font-bold leading-tight group-hover:underline xl:text-3xl">
                  {featuredArticle.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{featuredArticle.excerpt}</p>
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  By {featuredArticle.author} · {featuredArticle.date}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Sidebar Articles */}
        <div className="space-y-8">
          {otherArticles.map((article) => (
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
    </div>
  );
}
