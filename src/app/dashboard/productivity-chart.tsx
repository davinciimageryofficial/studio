
"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip, TooltipProps } from "recharts";
import { dailyProductivityData, weeklyProductivityData, monthlyProductivityData } from "@/lib/placeholder-data";

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-background border border-border rounded-lg shadow-lg">
        <p className="font-bold text-lg mb-2">{label}</p>
        {payload.map((pld, index) => (
          <div key={index} style={{ color: pld.color }}>
            <span className="font-semibold">{pld.name}: </span>
            <span>
              {pld.name === 'Client Rating' ? `${pld.value?.toFixed(1)}/5.0` : pld.value}
              {pld.name === 'Revenue' && 'x'}
              {pld.name === 'Rev. Per Project' && 'x'}
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
        <LineChart data={chartData}>
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
            />
             <YAxis 
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                domain={[0, 5]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                iconSize={10}
            />
            <Line yAxisId="left" type="monotone" dataKey="projects" name="Projects Completed" stroke="#000000" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#808080" strokeWidth={2} dot={{ r: 4 }}/>
            <Line yAxisId="right" type="monotone" dataKey="rating" name="Client Rating" stroke="#a1a1aa" strokeWidth={2} dot={{ r: 4 }}/>
            <Line yAxisId="left" type="monotone" dataKey="impressions" name="Impressions" stroke="#ff0000" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="left" type="monotone" dataKey="acquisition" name="Client Acquisition" stroke="#0000ff" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="left" type="monotone" dataKey="revPerProject" name="Rev. Per Project" stroke="#008080" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
    </ResponsiveContainer>
  );
}
