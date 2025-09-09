
"use client"

import { Bar, BarChart, Line, LineChart, Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, ComposedChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartData = [
  { day: "Monday", views: 186, connections: 5, searchAppearances: 400 },
  { day: "Tuesday", views: 305, connections: 7, searchAppearances: 550 },
  { day: "Wednesday", views: 237, connections: 4, searchAppearances: 480 },
  { day: "Thursday", views: 273, connections: 9, searchAppearances: 620 },
  { day: "Friday", views: 209, connections: 6, searchAppearances: 500 },
  { day: "Saturday", views: 214, connections: 3, searchAppearances: 380 },
  { day: "Sunday", views: 320, connections: 10, searchAppearances: 700 },
]

const chartConfig = {
  views: {
    label: "Profile Views",
    color: "hsl(var(--muted-foreground))",
  },
  connections: {
    label: "New Connections",
    color: "hsl(var(--primary))",
  },
  searchAppearances: {
    label: "Search Appearances",
    color: "hsl(var(--chart-2))",
  }
} satisfies ChartConfig

type EngagementChartProps = {
    type: "bar" | "line" | "area";
}

export function EngagementChart({ type }: EngagementChartProps) {
  const ChartComponent = {
    bar: BarChart,
    line: LineChart,
    area: ComposedChart, // Use ComposedChart for area to combine with line/bar
  }[type];

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ComposedChart
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
        <YAxis
            yAxisId="left"
            orientation="left"
            dataKey="views"
        />
        <YAxis
            yAxisId="right"
            orientation="right"
            dataKey="connections"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        
        {type === "bar" && <Bar dataKey="views" yAxisId="left" fill="var(--color-views)" radius={4} />}
        {type === "bar" && <Line type="monotone" yAxisId="right" dataKey="connections" stroke="var(--color-connections)" strokeWidth={2} />}
        {type === "bar" && <Line type="monotone" yAxisId="left" dataKey="searchAppearances" name="Search Appearances" stroke="var(--color-searchAppearances)" strokeWidth={2} strokeDasharray="5 5" />}


        {type === "line" && <Line type="monotone" yAxisId="left" dataKey="views" stroke="var(--color-views)" strokeWidth={2} dot={false} />}
        {type === "line" && <Line type="monotone" yAxisId="right" dataKey="connections" stroke="var(--color-connections)" strokeWidth={2} />}
        {type === "line" && <Line type="monotone" yAxisId="left" dataKey="searchAppearances" name="Search Appearances" stroke="var(--color-searchAppearances)" strokeWidth={2} strokeDasharray="5 5" />}

        
        {type === "area" && (
            <defs>
                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0.1}/>
                </linearGradient>
                 <linearGradient id="fillSearch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-searchAppearances)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-searchAppearances)" stopOpacity={0.05}/>
                </linearGradient>
            </defs>
        )}
        {type === "area" && <Area type="monotone" yAxisId="left" dataKey="views" stroke="var(--color-views)" fill="url(#fillViews)" />}
        {type === 'area' && <Line type="monotone" yAxisId="right" dataKey="connections" stroke="var(--color-connections)" strokeWidth={2} />}
        {type === 'area' && <Area type="monotone" yAxisId="left" dataKey="searchAppearances" name="Search Appearances" stroke="var(--color-searchAppearances)" fill="url(#fillSearch)" />}
        
      </ComposedChart>
    </ChartContainer>
  )
}
