
import { ClientOnly } from "@/components/layout/client-only";
import { getCourses } from "@/lib/database";
import { CoursesClient } from "./courses-client";

export default async function CoursesPage() {
    const courses = await getCourses();
    return (
        <ClientOnly>
            <CoursesClient initialCourses={courses} />
        </ClientOnly>
    )
}
