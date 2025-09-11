

"use client";

import { useState, useMemo } from "react";
import { ComposedChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip, TooltipProps, Bar } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dailyProfileEngagementData, weeklyProfileEngagementData, monthlyProfileEngagementData } from "@/lib/placeholder-data";
import { Settings, UserCheck } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Timeline = "daily" | "weekly" | "monthly";

export type VisibleEngagementMetrics = {
    views: boolean;
    connections: boolean;
    searches: boolean;
    likes: boolean;
    skillSyncNetMatches: boolean;
}

interface ProfileEngagementChartProps {
    timeline: Timeline;
    onTimelineChange: (timeline: Timeline) => void;
    visibleMetrics: VisibleEngagementMetrics;
    onMetricVisibilityChange: (metric: keyof VisibleEngagementMetrics, checked: boolean) => void;
}

const CustomTooltip = ({ active, payload, label, visibleMetrics }: TooltipProps<number, string> & { visibleMetrics: VisibleEngagementMetrics }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-background border border-border rounded-lg shadow-lg">
        <p className="font-bold text-lg mb-2">{label}</p>
        {payload.filter(pld => visibleMetrics[pld.dataKey as keyof VisibleEngagementMetrics]).map((pld, index) => (
          <div key={index} style={{ color: pld.stroke || pld.fill }} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.stroke || pld.fill }}></div>
            <span className="font-semibold">{pld.name}: </span>
            <span>{pld.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export function ProfileEngagementChart({ timeline, onTimelineChange, visibleMetrics, onMetricVisibilityChange }: ProfileEngagementChartProps) {
  const [scale, setScale] = useState(1);
  const [tempScale, setTempScale] = useState(1);
  
  const dataMap = {
    daily: dailyProfileEngagementData,
    weekly: weeklyProfileEngagementData,
    monthly: monthlyProfileEngagementData,
  };

  const chartData = useMemo(() => {
    return dataMap[timeline].map(item => ({
        ...item,
        views: Math.round(item.views * scale),
        connections: Math.round(item.connections * scale),
        searches: Math.round(item.searches * scale),
        likes: Math.round(item.likes * scale),
        skillSyncNetMatches: Math.round(item.skillSyncNetMatches * scale),
    }));
  }, [timeline, scale, dataMap]);

  const dataKey = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month',
  }[timeline];

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-6 w-6" />
            Profile Engagement
          </CardTitle>
          <CardDescription>
            A look at your profile engagement over time.
          </CardDescription>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="w-32 space-y-1">
            <Label htmlFor="engagement-scale" className="text-xs">Scale ({tempScale.toFixed(1)}x)</Label>
            <Slider
              id="engagement-scale"
              min={0.1}
              max={5}
              step={0.1}
              value={[tempScale]}
              onValueChange={(value) => setTempScale(value[0])}
              onValueCommit={(value) => setScale(value[0])}
            />
          </div>
           <Tabs defaultValue={timeline} onValueChange={(value) => onTimelineChange(value as any)} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3 sm:w-auto bg-black text-muted-foreground">
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
            </Tabs>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="default" size="icon" className="bg-black text-white">
                        <Settings className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle Metrics</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.keys(visibleMetrics).map((key) => (
                        <DropdownMenuCheckboxItem
                            key={key}
                            checked={visibleMetrics[key as keyof VisibleEngagementMetrics]}
                            onCheckedChange={(checked) => onMetricVisibilityChange(key as keyof VisibleEngagementMetrics, !!checked)}
                        >
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
             <defs>
                <pattern id="lines" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="4" height="4" fill="hsl(var(--card))" />
                    <path d="M 0 0 L 0 4" stroke="hsl(var(--primary))" strokeWidth="1" />
                </pattern>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={dataKey}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              label={{ value: "Count", angle: -90, position: 'insideLeft', offset: 0, style: { textAnchor: 'middle', fontSize: '12px', fill: '#888' } }}
            />
            <Tooltip content={<CustomTooltip visibleMetrics={visibleMetrics} />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {visibleMetrics.views && <Bar yAxisId="left" dataKey="views" name="Profile Views" fill="url(#lines)" stroke="hsl(var(--primary))" barSize={30} />}
            {visibleMetrics.connections && <Line yAxisId="left" type="monotone" dataKey="connections" name="New Connections" stroke="hsl(var(--chart-2))" />}
            {visibleMetrics.searches && <Line yAxisId="left" type="monotone" dataKey="searches" name="Search Appearances" stroke="hsl(var(--chart-1))" />}
            {visibleMetrics.likes && <Line yAxisId="left" type="monotone" dataKey="likes" name="Post Likes" stroke="hsl(var(--chart-4))" />}
            {visibleMetrics.skillSyncNetMatches && <Line yAxisId="left" type="monotone" dataKey="skillSyncNetMatches" name="Skill Sync Net Matches" stroke="hsl(var(--primary))" strokeDasharray="5 5" />}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

  
