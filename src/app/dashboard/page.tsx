import { ClientOnly } from "@/components/layout/client-only";
import { getDashboardPageData, getCurrentUser } from "@/lib/database";
import { DashboardPageInternal } from "./dashboard-client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
        // This should theoretically be handled by middleware, but as a safeguard
        redirect('/login');
    }
    const pageData = await getDashboardPageData(currentUser);

    return (
        <ClientOnly>
            <DashboardPageInternal
                currentUser={currentUser}
                otherUsers={pageData.otherUsers}
                dashboardMetrics={pageData.dashboardMetrics}
                personalMetrics={pageData.personalMetrics}
                agencyMetrics={pageData.agencyMetrics}
                initialTasks={pageData.initialTasks}
                notifications={[]}
            />
        </ClientOnly>
    );
}
