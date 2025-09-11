
"use client";

import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip, AreaChart, Area, Funnel, FunnelChart, LabelList, Cell, ComposedChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { timeManagementData, financialHealthData, clientManagementData, qualityPerformanceData } from "@/lib/placeholder-data";
import { TrendingUp, Wallet, Users, Award } from "lucide-react";

export function OperationalCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
      {/* Time Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Time & Productivity</CardTitle>
          <CardDescription>Billable hours and task completion trends.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeManagementData.billableHours} stackOffset="expand">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value * 100}%`} />
              <Tooltip formatter={(value, name, props) => `${(props.payload[name] / (props.payload.billable + props.payload.nonBillable) * 100).toFixed(0)}%`}/>
              <Legend />
              <Bar dataKey="billable" fill="hsl(var(--primary))" stackId="a" name="Billable" />
              <Bar dataKey="nonBillable" fill="hsl(var(--muted))" stackId="a" name="Non-Billable" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" />Financial Health</CardTitle>
          <CardDescription>Income sources and cash flow analysis.</CardDescription>
        </CardHeader>
        <CardContent>
           <ResponsiveContainer width="100%" height={300}>
             <AreaChart data={financialHealthData.cashFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis unit="$" tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2), 0.5)" />
                <Area type="monotone" dataKey="expenses" stackId="1" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive), 0.5)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Client Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Client Management</CardTitle>
          <CardDescription>Lead conversion funnel and project value analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={clientManagementData.leadConversion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis yAxisId="left" label={{ value: 'Leads', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" unit="$" label={{ value: 'Avg. Project Value', angle: -90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="value" name="Leads" fill="hsl(var(--primary), 0.7)">
                  {clientManagementData.leadConversion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--primary), ${1 - index * 0.25})`} />
                  ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="avgProjectValue" name="Avg. Project Value" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quality and Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Quality & Performance</CardTitle>
          <CardDescription>Portfolio updates over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityPerformanceData.portfolioUpdates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="New Portfolio Items" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
