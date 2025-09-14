
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus, Briefcase, DollarSign, Award, Users, TrendingUp, Workflow } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

type Metric = {
    name: string;
    value: string;
    change?: string;
    trend?: 'positive' | 'negative' | 'neutral';
};

type MetricCategory = {
    title: string;
    icon: React.ReactNode;
    metrics: Metric[];
};

type MetricGroup = {
    title: string;
    categories: MetricCategory[];
};

type AgencyMetricsProps = {
    metrics: {
        financials: { monthlyRevenue: number; monthlyProfit: number; };
        clients: { activeClients: number; satisfaction: number; };
        projects: { activeProjects: number; onTimeDelivery: number; budgetAdherence: number; };
        team: { satisfaction: number; capacity: number; };
    } | null;
    isLoading: boolean;
}

const trendIcons = {
    positive: <ArrowUp className="h-4 w-4 text-green-600" />,
    negative: <ArrowDown className="h-4 w-4 text-red-600" />,
    neutral: <Minus className="h-4 w-4 text-muted-foreground" />,
};

const trendColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-muted-foreground",
};

function MetricDisplay({ metric }: { metric: Metric }) {
    return (
        <div className="flex justify-between items-center py-2">
            <p className="text-sm text-muted-foreground">{metric.name}</p>
            <div className="flex items-center gap-4">
                <p className="text-sm font-semibold">{metric.value}</p>
                {metric.change && metric.trend && (
                    <div className={cn("flex items-center text-sm font-semibold w-16 justify-end", trendColors[metric.trend])}>
                        {trendIcons[metric.trend]}
                        <span>{metric.change}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

function AgencyMetricsSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(2)].map((_, j) => (
                            <div key={j} className="space-y-3">
                                <Skeleton className="h-5 w-1/3" />
                                <div className="space-y-3 pl-4">
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function AgencyMetrics({ metrics, isLoading }: AgencyMetricsProps) {
    if (isLoading) {
        return <AgencyMetricsSkeleton />;
    }
    
    if (!metrics) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    No agency metrics data available. Please set up your agency in the database.
                </CardContent>
            </Card>
        )
    }

    const agencyMetricsData = {
        "Client & Financial Health": {
            title: "Client & Financial Health",
            categories: [
                {
                    title: "Client Health",
                    icon: <Users className="h-5 w-5" />,
                    metrics: [
                        { name: "Active Clients", value: String(metrics.clients.activeClients), change: "+2", trend: "positive" },
                        { name: "Client Satisfaction", value: `${metrics.clients.satisfaction}/5.0`, change: "+0.1", trend: "positive" },
                    ],
                },
                {
                    title: "Financials",
                    icon: <DollarSign className="h-5 w-5" />,
                    metrics: [
                        { name: "Monthly Revenue", value: `$${metrics.financials.monthlyRevenue.toLocaleString()}`, change: "+8.5%", trend: "positive" },
                        { name: "Monthly Profit", value: `$${metrics.financials.monthlyProfit.toLocaleString()}`, change: "+12%", trend: "positive" },
                    ],
                },
            ],
        },
        "Operational Excellence": {
            title: "Operational Excellence",
            categories: [
                {
                    title: "Project Delivery",
                    icon: <Briefcase className="h-5 w-5" />,
                    metrics: [
                        { name: "Active Projects", value: String(metrics.projects.activeProjects), change: "+1", trend: "neutral" },
                        { name: "On-Time Delivery", value: `${metrics.projects.onTimeDelivery}%`, change: "-0.5%", trend: "negative" },
                        { name: "Budget Adherence", value: `${metrics.projects.budgetAdherence}%`, trend: "neutral" },
                    ],
                },
                {
                    title: "Team & Workflow",
                    icon: <Workflow className="h-5 w-5" />,
                    metrics: [
                        { name: "Team Satisfaction", value: `${metrics.team.satisfaction}/5.0`, trend: "positive" },
                        { name: "Team Capacity", value: `${metrics.team.capacity}% Utilized`, change: "+5%", trend: "negative" },
                    ],
                },
            ],
        },
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.values(agencyMetricsData).map((groupData) => (
                <Card key={groupData.title} className={cn("flex flex-col", { "border-black": groupData.title === "Client & Financial Health" || groupData.title === "Operational Excellence" })}>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">{groupData.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Accordion type="multiple" defaultValue={groupData.categories.map(c => c.title)}>
                            {groupData.categories.map((category) => (
                                <AccordionItem key={category.title} value={category.title}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-3">
                                            {category.icon}
                                            <span className="font-semibold">{category.title}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="divide-y">
                                        {category.metrics.map((metric) => (
                                            <MetricDisplay key={metric.name} metric={metric} />
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
