
import { ClientOnly } from "@/components/layout/client-only";
import { CoursesClient } from "./courses-client";
import { getCourses } from "@/lib/database";

export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <ClientOnly>
            <CoursesClient initialCourses={courses} />
        </ClientOnly>
    );
}

  