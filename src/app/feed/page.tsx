import { ClientOnly } from "@/components/layout/client-only";
import { getPosts, getCurrentUser } from "@/lib/database";
import { FeedClient } from "./feed-client";
import { redirect } from "next/navigation";

export default async function FeedPage() {
    const [posts, currentUser] = await Promise.all([
        getPosts(),
        getCurrentUser()
    ]);

    if (!currentUser) {
        // This should be handled by middleware, but it's a good safeguard
        redirect('/login');
    }
    
    return (
        <ClientOnly>
            <FeedClient initialPosts={posts} currentUser={currentUser} />
        </ClientOnly>
    )
}
