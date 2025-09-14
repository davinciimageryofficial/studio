
"use client";

import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip, AreaChart, Area, Funnel, FunnelChart, LabelList, Cell, ComposedChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Wallet, Users, Award, Settings } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAgencyOperationalChartData } from "@/lib/database";
import { Skeleton } from "@/components/ui/skeleton";


type VisibleMetrics = {
    revenue: boolean;
    expenses: boolean;
    profit: boolean;
    leads: boolean;
    projectsWon: boolean;
    portfolioUpdates: boolean;
}

type ChartDataType = {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    leads: number;
    projectsWon: number;
    portfolioUpdates: number;
}

export function OperationalCharts() {
  const [scale, setScale] = useState(1);
  const [tempScale, setTempScale] = useState(1);
  const [visibleMetrics, setVisibleMetrics] = useState<VisibleMetrics>({
    revenue: true,
    expenses: true,
    profit: true,
    leads: true,
    projectsWon: true,
    portfolioUpdates: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState<ChartDataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const data = await getAgencyOperationalChartData();
        setOriginalData(data as ChartDataType[]);
        setIsLoading(false);
    };
    fetchData();
  }, []);


  const chartData = useMemo(() => {
    return originalData.map(item => {
      const revenue = item.revenue * scale;
      const expenses = item.expenses * scale;
      return {
        ...item,
        revenue,
        expenses,
        profit: revenue - expenses,
        leads: Math.round(item.leads * scale),
        projectsWon: Math.round(item.projectsWon * scale),
        portfolioUpdates: Math.round(item.portfolioUpdates * scale),
      }
    });
  }, [scale, originalData]);
  
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
          {isLoading ? (
            <div className="h-[400px] w-full flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData}>
                <defs>
                      <linearGradient id="gradient-revenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradient-expenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                  </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" unit="$" tickFormatter={(value) => `${value}k`} />
                <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
                <Tooltip formatter={(value: number, name: string) => {
                    if (name === 'Revenue' || name === 'Expenses' || name === 'Profit') {
                        return `$${(value * 1000).toLocaleString()}`;
                    }
                    return value;
                }} />
                <Legend />
                {visibleMetrics.revenue && <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#gradient-revenue)" strokeWidth={3} />}
                {visibleMetrics.expenses && <Area yAxisId="left" type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" fillOpacity={1} fill="url(#gradient-expenses)" />}
                {visibleMetrics.profit && <Line yAxisId="left" type="monotone" dataKey="profit" name="Profit" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" />}
                {visibleMetrics.leads && <Line yAxisId="right" type="monotone" dataKey="leads" name="New Leads" stroke="#a1a1aa" strokeWidth={2} />}
                {visibleMetrics.projectsWon && <Line yAxisId="right" type="monotone" dataKey="projectsWon" name="Projects Won" stroke="#06b6d4" strokeWidth={2} />}
                {visibleMetrics.portfolioUpdates && <Line yAxisId="right" type="monotone" dataKey="portfolioUpdates" name="Portfolio Updates" stroke="hsl(var(--chart-4))" strokeWidth={2} />}
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
