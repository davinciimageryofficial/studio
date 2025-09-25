
import { ClientOnly } from "@/components/layout/client-only";
import { getNews } from "@/lib/database";
import { NewsClient } from "./news-client";

// This is now a pure Server Component. It fetches data and passes it to the Client Component.
export default async function NewsPage() {
    const articles = await getNews();
    return (
        <ClientOnly>
            <NewsClient initialArticles={articles} />
        </ClientOnly>
    )
}
