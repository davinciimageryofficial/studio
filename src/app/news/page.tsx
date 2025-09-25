
"use client";

import { useState, useEffect } from "react";
import { ClientOnly } from "@/components/layout/client-only";
import { NewsClient } from "./news-client";
import { getNews } from "@/lib/database";
import type { Article } from "@/lib/types";


export default function NewsPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            const data = await getNews();
            setArticles(data);
            setIsLoading(false);
        }
        fetchNews();
    }, []);

    return (
        <ClientOnly>
            <NewsClient initialArticles={articles} />
        </ClientOnly>
    );
}
