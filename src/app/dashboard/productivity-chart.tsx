
"use client"

import { ComposedChart, Bar, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip, TooltipProps } from "recharts";
import { dailyProductivityData, weeklyProductivityData, monthlyProductivityData } from "@/lib/placeholder-data";

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-background border border-border rounded-lg shadow-lg">
        <p className="font-bold text-lg mb-2">{label}</p>
        {payload.map((pld, index) => (
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
}

export function ProductivityChart({ timeline }: ProductivityChartProps) {

  const dataMap = {
    daily: dailyProductivityData,
    weekly: weeklyProductivityData,
    monthly: monthlyProductivityData,
  };

  const chartData = dataMap[timeline];
  const dataKey = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month',
  }[timeline];

  return (
     <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
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
                label={{ value: "Revenue & Projects", angle: -90, position: 'insideLeft', offset: -10 }}
            />
             <YAxis 
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                domain={[0, 'dataMax + 1000']}
                label={{ value: "Impressions & Clients", angle: 90, position: 'insideRight', offset: -10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                iconSize={10}
            />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
            <Line yAxisId="left" type="monotone" dataKey="projects" name="Projects" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="impressions" name="Impressions" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="acquisition" name="New Clients" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="left" type="monotone" dataKey="revPerProject" name="Rev. Per Project" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }}/>
        </ComposedChart>
    </ResponsiveContainer>
  );
}
