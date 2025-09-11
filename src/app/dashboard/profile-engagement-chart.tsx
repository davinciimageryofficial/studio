
"use client";

import { useState, useMemo } from "react";
import { ComposedChart, Bar, Line, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileEngagementData } from "@/lib/placeholder-data";
import { UserCheck } from "lucide-react";

export function ProfileEngagementChart() {
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar");
  const [scale, setScale] = useState(1);
  const [tempScale, setTempScale] = useState(1);

  const chartData = useMemo(() => {
    return profileEngagementData.map(item => ({
        ...item,
        views: Math.round(item.views * scale),
        connections: Math.round(item.connections * scale),
        searches: Math.round(item.searches * scale),
    }));
  }, [scale]);

  const ChartComponent = {
    bar: Bar,
    line: Line,
    area: Area,
  }[chartType];

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-6 w-6" />
            Profile Engagement
          </CardTitle>
          <CardDescription>
            A look at your profile views over the last 7 days.
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
          <Tabs defaultValue="bar" onValueChange={(value) => setChartType(value as any)} className="w-full sm:w-auto">
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
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
            <ChartComponent yAxisId="right" type="monotone" dataKey="searches" name="Search Appearances" fill="hsl(var(--chart-4))" stroke="hsl(var(--chart-4))" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
