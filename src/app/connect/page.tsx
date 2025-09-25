

"use client";

import { ClientOnly } from "@/components/layout/client-only";
import { CoursesClient } from "./courses-client";
import { getCourses } from "@/lib/database";
import { useEffect, useState } from "react";
import type { Course } from "@/lib/types";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    
    useEffect(() => {
        const fetchCourses = async () => {
            const data = await getCourses();
            setCourses(data);
        }
        fetchCourses();
    }, []);

    return (
        <ClientOnly>
            <CoursesClient initialCourses={courses} />
        </ClientOnly>
    );
}
