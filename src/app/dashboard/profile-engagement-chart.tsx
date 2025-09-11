

"use client";

import { useState, useMemo } from "react";
import { ComposedChart, Bar, Line, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dailyProfileEngagementData, weeklyProfileEngagementData, monthlyProfileEngagementData } from "@/lib/placeholder-data";
import { UserCheck } from "lucide-react";

type Timeline = "daily" | "weekly" | "monthly";

interface ProfileEngagementChartProps {
    timeline: Timeline;
    onTimelineChange: (timeline: Timeline) => void;
}

export function ProfileEngagementChart({ timeline, onTimelineChange }: ProfileEngagementChartProps) {
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("line");
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

  const ChartComponent = {
    bar: Bar,
    line: Line,
    area: Area,
  }[chartType];

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
          <Tabs defaultValue={chartType} onValueChange={(value) => setChartType(value as any)} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 sm:w-auto bg-black text-muted-foreground">
              <TabsTrigger value="bar">Bar</TabsTrigger>
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
             <defs>
                <pattern id="lines" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="8" height="8" fill="hsl(var(--card))" />
                    <path d="M 0 0 L 0 8" stroke="hsl(var(--chart-1))" strokeWidth="1" />
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
              label={{ value: "Views / Connections", angle: -90, position: 'insideLeft', offset: 0, style: { textAnchor: 'middle', fontSize: '12px', fill: '#888' } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
               label={{ value: "Search Appearances", angle: 90, position: 'insideRight', offset: 0, style: { textAnchor: 'middle', fontSize: '12px', fill: '#888' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <ChartComponent yAxisId="left" type="monotone" dataKey="views" name="Profile Views" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
            <Line yAxisId="left" type="monotone" dataKey="connections" name="New Connections" stroke="hsl(var(--chart-2))" />
            <Line yAxisId="left" type="monotone" dataKey="likes" name="Post Likes" stroke="hsl(var(--chart-4))" />
            <Line yAxisId="left" type="monotone" dataKey="skillSyncNetMatches" name="Skill Sync Net Matches" stroke="hsl(var(--destructive))" />
            <ChartComponent yAxisId="right" type="monotone" dataKey="searches" name="Search Appearances" fill="url(#lines)" stroke="hsl(var(--chart-1))" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

  
