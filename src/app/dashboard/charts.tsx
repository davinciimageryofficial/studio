
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

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

export function EngagementChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
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
        <Bar dataKey="views" fill="var(--color-views)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
