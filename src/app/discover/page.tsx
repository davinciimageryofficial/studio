
import { ClientOnly } from "@/components/layout/client-only";
import { DiscoverClient } from "./discover-client";
import { getUsers } from "@/lib/database";
import type { User } from "@/lib/types";

export default async function DiscoverPage() {
    const users: User[] = await getUsers();

    return (
        <ClientOnly>
            <DiscoverClient initialUsers={users} />
        </ClientOnly>
    );
}

  