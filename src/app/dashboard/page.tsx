import { ClientOnly } from "@/components/layout/client-only";
import { getDashboardPageData } from "@/lib/database";
import { DashboardPageInternal } from "./dashboard-client";

export default async function DashboardPage() {
    const pageData = await getDashboardPageData();

    return (
        <ClientOnly>
            <DashboardPageInternal
                currentUser={pageData.currentUser}
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

    