
"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip, TooltipProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { productivityData } from "@/lib/placeholder-data";

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
              {pld.name === 'Revenue' && 'k'}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export function ProductivityChart() {
  return (
     <ResponsiveContainer width="100%" height={400}>
        <LineChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
                dataKey="month" 
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
            <Line yAxisId="left" type="monotone" dataKey="projects" name="Projects Completed" stroke="#18181b" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue ($k)" stroke="#71717a" strokeWidth={2} dot={{ r: 4 }}/>
            <Line yAxisId="right" type="monotone" dataKey="rating" name="Client Rating" stroke="#a1a1aa" strokeWidth={2} dot={{ r: 4 }}/>
            <Line yAxisId="left" type="monotone" dataKey="impressions" name="Impressions" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
    </ResponsiveContainer>
  );
}

