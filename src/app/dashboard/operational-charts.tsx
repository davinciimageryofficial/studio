
"use client";

import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip, AreaChart, Area, Funnel, FunnelChart, LabelList, Cell, ComposedChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { monthlyProductivityData, weeklyProductivityData } from "@/lib/placeholder-data";
import { TrendingUp, Wallet, Users, Award, Settings } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


type VisibleMetrics = {
    revenue: boolean;
    expenses: boolean;
    leads: boolean;
    projectsWon: boolean;
    portfolioUpdates: boolean;
}

export function OperationalCharts() {
  const [timeline, setTimeline] = useState<"monthly" | "weekly">("monthly");
  const [scale, setScale] = useState(1);
  const [tempScale, setTempScale] = useState(1);
  const [visibleMetrics, setVisibleMetrics] = useState<VisibleMetrics>({
    revenue: true,
    expenses: true,
    leads: true,
    projectsWon: true,
    portfolioUpdates: true,
  });

  const dataMap = {
    monthly: monthlyProductivityData,
    weekly: weeklyProductivityData,
  };

  const chartData = useMemo(() => {
    const rawData = dataMap[timeline].map(d => ({
        ...d,
        expenses: d.revenue * (0.6 + Math.random() * 0.2), // Simulate expenses
        leads: d.acquisition * 8 + Math.floor(Math.random() * 5),
    }));
    
    return rawData.map(item => ({
      ...item,
      revenue: Math.round(item.revenue * scale),
      expenses: Math.round(item.expenses * scale),
      leads: Math.round(item.leads * scale),
      projectsWon: Math.round(item.projects * scale),
      portfolioUpdates: Math.round((item.impressions / 2000) * scale),
    }));
  }, [timeline, scale, dataMap]);
  
  const dataKey = timeline === 'monthly' ? 'month' : 'week';

  const handleMetricVisibilityChange = (metric: keyof VisibleMetrics, checked: boolean) => {
    setVisibleMetrics(prev => ({ ...prev, [metric]: checked }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
      <Card>
        <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Agency Performance Overview</CardTitle>
            <CardDescription>A unified view of your agency's financial, client, and project metrics.</CardDescription>
          </div>
           <div className="flex w-full sm:w-auto items-center gap-2">
                <div className="w-32 space-y-1">
                    <Label htmlFor="agency-scale" className="text-xs">Scale ({tempScale.toFixed(1)}x)</Label>
                    <Slider
                        id="agency-scale"
                        min={0.1} max={5} step={0.1}
                        value={[tempScale]}
                        onValueChange={(value) => setTempScale(value[0])}
                        onValueCommit={(value) => setScale(value[0])}
                    />
                </div>
                <Tabs defaultValue="monthly" onValueChange={(value) => setTimeline(value as any)} className="w-full sm:w-auto">
                    <TabsList className="grid w-full grid-cols-2 sm:w-auto bg-black text-muted-foreground">
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
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
                                checked={visibleMetrics[key as keyof VisibleMetrics]}
                                onCheckedChange={(checked) => handleMetricVisibilityChange(key as keyof VisibleMetrics, !!checked)}
                            >
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
               <defs>
                    <linearGradient id="gradient-expenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                    <pattern id="lines" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="4" height="4" fill="hsl(var(--card))" />
                        <path d="M 0 0 L 0 4" stroke="hsl(var(--chart-3))" strokeWidth="1" />
                    </pattern>
                </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKey} />
              <YAxis yAxisId="left" unit="$" tickFormatter={(value) => `${value}k`} />
              <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
              <Tooltip formatter={(value: number, name: string) => {
                  if (name === 'Revenue' || name === 'Expenses') {
                      return `$${(value * 1000).toLocaleString()}`;
                  }
                  return value;
              }} />
              <Legend />
              {visibleMetrics.revenue && <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />}
              {visibleMetrics.expenses && <Area yAxisId="left" type="monotone" dataKey="expenses" name="Expenses" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#gradient-expenses)" />}
              {visibleMetrics.leads && <Bar yAxisId="right" dataKey="leads" name="New Leads" fill="url(#lines)" />}
              {visibleMetrics.projectsWon && <Line yAxisId="right" type="monotone" dataKey="projectsWon" name="Projects Won" stroke="hsl(var(--chart-3))" strokeWidth={2} />}
              {visibleMetrics.portfolioUpdates && <Line yAxisId="right" type="monotone" dataKey="portfolioUpdates" name="Portfolio Updates" stroke="hsl(var(--chart-4))" strokeWidth={2} />}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
