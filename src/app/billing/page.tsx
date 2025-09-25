
"use client";

import { ClientOnly } from "@/components/layout/client-only";
import { BillingClient } from "./billing-client";
import { getBillingInfo } from "@/lib/database";

export default async function BillingPage() {
    const data = await getBillingInfo();
    return (
        <ClientOnly>
            <BillingClient initialData={data} />
        </ClientOnly>
    );
}
