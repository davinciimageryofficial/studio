
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { agencyMetricsData } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

type Metric = {
    name: string;
    value: string;
    change: string;
    trend: 'positive' | 'negative' | 'neutral';
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

function MetricCard({ title, metrics }: { title: string; metrics: Metric[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {metrics.map((metric) => (
                    <div key={metric.name}>
                        <div className="flex justify-between items-baseline">
                            <p className="text-sm text-muted-foreground">{metric.name}</p>
                            {metric.change && (
                                <div className={cn("flex items-center text-sm font-semibold", trendColors[metric.trend])}>
                                    {trendIcons[metric.trend]}
                                    <span>{metric.change}</span>
                                </div>
                            )}
                        </div>
                        <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export function AgencyMetrics() {
    const { efficiency, productivity, financial, quality, customer, employee, process } = agencyMetricsData;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard title="Efficiency Metrics" metrics={efficiency} />
            <MetricCard title="Productivity Metrics" metrics={productivity} />
            <MetricCard title="Financial Metrics" metrics={financial} />
            <MetricCard title="Quality Metrics" metrics={quality} />
            <MetricCard title="Customer & Client Metrics" metrics={customer} />
            <MetricCard title="Employee Performance" metrics={employee} />
            <MetricCard title="Process & Workflow" metrics={process} />
        </div>
    );
}
