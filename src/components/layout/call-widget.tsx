
"use client";

import { useWorkspace } from "@/context/workspace-context";
import { usePathname } from "next/navigation";
import { Mic, PhoneOff } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function CallWidget() {
    const { isActive, sessionType, time, formatTime, endSession } = useWorkspace();
    const pathname = usePathname();

    const isWorkspacePage = pathname.startsWith('/workspaces');
    
    if (!isActive || isWorkspacePage || sessionType !== 'solo') {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="flex items-center gap-4 rounded-lg border bg-card p-3 text-card-foreground shadow-2xl">
                <div className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-primary animate-pulse" />
                    <div>
                        <p className="font-semibold">Solo Session</p>
                        <p className="font-mono text-sm text-muted-foreground">{formatTime(time)}</p>
                    </div>
                </div>
                 <Button asChild variant="outline" size="sm">
                    <Link href="/workspaces">Return to Session</Link>
                </Button>
                <Button variant="destructive" size="icon" className="h-9 w-9" onClick={endSession}>
                    <PhoneOff className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
