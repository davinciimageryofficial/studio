
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { agencyMetricsData } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus, Briefcase, DollarSign, Award, Users, TrendingUp, Workflow } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Metric = {
    name: string;
    value: string;
    change: string;
    trend: 'positive' | 'negative' | 'neutral';
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
                {metric.change && (
                    <div className={cn("flex items-center text-sm font-semibold w-16 justify-end", trendColors[metric.trend])}>
                        {trendIcons[metric.trend]}
                        <span>{metric.change}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export function AgencyMetrics() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(agencyMetricsData).map(([groupTitle, groupData]) => (
                <Card key={groupTitle} className={cn("flex flex-col", { "border-black": groupData.title === "Client & Financial Health" || groupData.title === "Operational Excellence" })}>
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
