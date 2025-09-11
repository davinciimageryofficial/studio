
"use client";

import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip, AreaChart, Area, Funnel, FunnelChart, LabelList, Cell, ComposedChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { timeManagementData, financialHealthData, clientManagementData, qualityPerformanceData } from "@/lib/placeholder-data";
import { TrendingUp, Wallet, Users, Award } from "lucide-react";

export function OperationalCharts() {
  const combinedData = financialHealthData.cashFlow.map((finance, index) => ({
    ...finance,
    leads: clientManagementData.leadConversion[index]?.value || 0,
    projectsWon: clientManagementData.leadConversion[index+2]?.value || 0,
    portfolioUpdates: qualityPerformanceData.portfolioUpdates[index]?.count || 0,
  }));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Agency Performance Overview</CardTitle>
          <CardDescription>A unified view of your agency's financial, client, and project metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" unit="$" tickFormatter={(value) => `${value / 1000}k`} />
              <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
              <Tooltip formatter={(value: number, name: string) => {
                  if (name === 'Revenue' || name === 'Expenses') {
                      return `$${value.toLocaleString()}`;
                  }
                  return value;
              }} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2), 0.4)" />
              <Area yAxisId="left" type="monotone" dataKey="expenses" name="Expenses" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive), 0.4)" />
              <Bar yAxisId="right" dataKey="leads" name="New Leads" fill="hsl(var(--primary), 0.5)" />
              <Line yAxisId="right" type="monotone" dataKey="portfolioUpdates" name="Portfolio Updates" stroke="hsl(var(--chart-4))" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

