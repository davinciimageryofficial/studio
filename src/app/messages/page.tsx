
import { ClientOnly } from "@/components/layout/client-only";
import { MessagesClient } from "./messages-client";
import { getConversations, getUsers } from "@/lib/database";

export default async function MessagesPage() {
  const [conversations, allUsers] = await Promise.all([
    getConversations(),
    getUsers(),
  ]);

  return (
    <ClientOnly>
      <MessagesClient initialConversations={conversations} initialAllUsers={allUsers} />
    </ClientOnly>
  );
}
