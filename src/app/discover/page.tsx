
import { ClientOnly } from "@/components/layout/client-only";
import { getUsers } from "@/lib/database";
import { DiscoverClient } from "./discover-client";

export default async function DiscoverPage() {
    const users = await getUsers();
    return (
        <ClientOnly>
            <DiscoverClient initialUsers={users} />
        </ClientOnly>
    )
}
