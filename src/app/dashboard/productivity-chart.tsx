
"use client"

import { useMemo, useState, useEffect } from "react";
import { ComposedChart, Bar, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip, TooltipProps } from "recharts";
import { getPersonalProductivityChartData } from "@/lib/database";
import { Skeleton } from "@/components/ui/skeleton";

type VisibleMetrics = {
    revenue: boolean;
    projects: boolean;
    impressions: boolean;
    acquisition: boolean;
    revPerProject: boolean;
}

const CustomTooltip = ({ active, payload, label, visibleMetrics }: TooltipProps<number, string> & { visibleMetrics: VisibleMetrics }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-background border border-border rounded-lg shadow-lg">
        <p className="font-bold text-lg mb-2">{label}</p>
        {payload.filter(pld => visibleMetrics[pld.dataKey as keyof VisibleMetrics]).map((pld, index) => (
          <div key={index} style={{ color: pld.stroke || pld.fill }} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.stroke || pld.fill }}></div>
            <span className="font-semibold">{pld.name}: </span>
            <span>
              {pld.name === 'Client Rating' ? `${pld.value?.toFixed(1)}/5.0` : ''}
              {pld.name === 'Revenue' && `$${(pld.value as number * 1000).toLocaleString()}`}
              {pld.name === 'Rev. Per Project' && `$${((pld.value || 0) as number * 1000).toLocaleString()}`}
              {pld.name === 'Impressions' && `${(pld.value as number).toLocaleString()}`}
              {pld.name === 'New Clients' && pld.value}
              {pld.name === 'Projects' && pld.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

type ProductivityChartProps = {
    timeline: 'daily' | 'weekly' | 'monthly';
    visibleMetrics: VisibleMetrics;
    scale: number;
}

const renderLegendText = (value: string) => {
  return <span className="text-foreground">{value}</span>;
};


export function ProductivityChart({ timeline, visibleMetrics, scale }: ProductivityChartProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getPersonalProductivityChartData(timeline);
      setOriginalData(data);
      setIsLoading(false);
    }
    fetchData();
  }, [timeline]);

  const chartData = useMemo(() => {
    return originalData.map(item => ({
        ...item,
        revenue: (item.revenue || 0) * scale,
        projects: Math.round((item.projects || 0) * scale),
        impressions: Math.round((item.impressions || 0) * scale),
        acquisition: Math.round((item.acquisition || 0) * scale),
        revPerProject: (item.revPerProject || 0) * scale,
    }));
  }, [scale, originalData]);

  const dataKey = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month',
  }[timeline];

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    )
  }

  return (
     <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <defs>
                <pattern id="lines" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="8" height="8" fill="hsl(var(--card))" />
                    <path d="M 0 0 L 0 8" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                </pattern>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
                dataKey={dataKey}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
            />
            <YAxis 
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => `$${value}k`}
            />
             <YAxis 
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                domain={[0, 'dataMax + 1000']}
            />
            <Tooltip content={<CustomTooltip visibleMetrics={visibleMetrics} />} />
            <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                iconSize={10}
                formatter={renderLegendText}
            />
            {visibleMetrics.revenue && <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="url(#lines)" radius={[4, 4, 0, 0]} barSize={30} />}
            {visibleMetrics.projects && <Line yAxisId="left" type="monotone" dataKey="projects" name="Projects" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />}
            {visibleMetrics.impressions && <Line yAxisId="right" type="monotone" dataKey="impressions" name="Impressions" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4 }} />}
            {visibleMetrics.acquisition && <Line yAxisId="right" type="monotone" dataKey="acquisition" name="New Clients" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />}
            {visibleMetrics.revPerProject && <Line yAxisId="left" type="monotone" dataKey="revPerProject" name="Rev. Per Project" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }}/>}
        </ComposedChart>
    </ResponsiveContainer>
  );
}
