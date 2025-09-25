
import { ClientOnly } from "@/components/layout/client-only";
import { getPosts, getCurrentUser } from "@/lib/database";
import { FeedClient } from "./feed-client";

export default async function FeedPage() {
    const posts = await getPosts();
    const currentUser = await getCurrentUser();
    
    return (
        <ClientOnly>
            <FeedClient initialPosts={posts} currentUser={currentUser} />
        </ClientOnly>
    )
}
