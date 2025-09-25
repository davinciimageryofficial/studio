
import { ClientOnly } from "@/components/layout/client-only";
import { NewsClient } from "./news-client";
import { getNews } from "@/lib/database";
import type { Article } from "@/lib/types";

export default async function NewsPage() {
    const articles: Article[] = await getNews();

    return (
        <ClientOnly>
            <NewsClient initialArticles={articles} />
        </ClientOnly>
    );
}

  