
import { ClientOnly } from "@/components/layout/client-only";
import { MessagesClient } from "./messages-client";

export default function MessagesPage() {
  return (
    <ClientOnly>
      <MessagesClient />
    </ClientOnly>
  );
}
