import { ClientOnly } from "@/components/layout/client-only";
import { getBillingInfo } from "@/lib/database";
import { BillingClient } from "./billing-client";

export default async function BillingPage() {
    const data = await getBillingInfo();
    return (
        <ClientOnly>
            <BillingClient initialData={data} />
        </ClientOnly>
    );
}
