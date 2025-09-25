import { notFound } from "next/navigation";
import { getProfilePageData } from "@/lib/database";
import { ClientOnly } from "@/components/layout/client-only";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { user, experiences, currentUser } = await getProfilePageData(params.id);

  if (!user) {
    notFound();
  }

  return (
    <ClientOnly>
      <ProfileClient 
        initialUser={user} 
        initialExperiences={experiences}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}
