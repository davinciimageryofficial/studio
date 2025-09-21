
import { ClientOnly } from "@/components/layout/client-only";
import { MessagesClient } from "./messages-client";
import { getConversations, getUsers, getCurrentUser } from "@/lib/database";

export default async function MessagesPage() {
  const [conversations, allUsers, currentUser] = await Promise.all([
    getConversations(),
    getUsers(),
    getCurrentUser(),
  ]);

  return (
    <ClientOnly>
      <MessagesClient 
        initialConversations={conversations} 
        initialAllUsers={allUsers} 
        currentUser={currentUser} 
      />
    </ClientOnly>
  );
}
