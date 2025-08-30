
"use client"

import { Bar, BarChart, Line, LineChart, Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { day: "Monday", views: 186 },
  { day: "Tuesday", views: 305 },
  { day: "Wednesday", views: 237 },
  { day: "Thursday", views: 273 },
  { day: "Friday", views: 209 },
  { day: "Saturday", views: 214 },
  { day: "Sunday", views: 320 },
]

const chartConfig = {
  views: {
    label: "Page Views",
    color: "hsl(0 0% 0%)",
  },
} satisfies ChartConfig

type EngagementChartProps = {
    type: "bar" | "line" | "area";
}

export function EngagementChart({ type }: EngagementChartProps) {
  const ChartComponent = {
    bar: BarChart,
    line: LineChart,
    area: AreaChart,
  }[type];

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ChartComponent
        accessibilityLayer 
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        {type === "bar" && <Bar dataKey="views" fill="var(--color-views)" radius={4} />}
        {type === "line" && <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} dot={false} />}
        {type === "area" && (
            <defs>
                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0.1}/>
                </linearGradient>
            </defs>
        )}
        {type === "area" && <Area type="monotone" dataKey="views" stroke="var(--color-views)" fill="url(#fillViews)" />}
      </ChartComponent>
    </ChartContainer>
  )
}
