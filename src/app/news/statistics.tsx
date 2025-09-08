
"use client";

import { useState } from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const skillsData = [
  { name: "TypeScript", mentions: 4500 },
  { name: "React", mentions: 4200 },
  { name: "Python", mentions: 3800 },
  { name: "SQL", mentions: 3500 },
  { name: "AWS", mentions: 3200 },
  { name: "Figma", mentions: 2800 },
  { name: "Node.js", mentions: 2500 },
];

const rateData = [
  { month: "Jan", Development: 95, Design: 80, Writing: 70 },
  { month: "Feb", Development: 98, Design: 82, Writing: 72 },
  { month: "Mar", Development: 102, Design: 85, Writing: 75 },
  { month: "Apr", Development: 105, Design: 88, Writing: 78 },
  { month: "May", Development: 110, Design: 90, Writing: 80 },
  { month: "Jun", Development: 112, Design: 95, Writing: 82 },
];

const toolsData = [
    { name: 'Figma', popularity: 90 },
    { name: 'Adobe CC', popularity: 85 },
    { name: 'VS Code', popularity: 95 },
    { name: 'Notion', popularity: 80 },
    { name: 'Jira', popularity: 70 },
    { name: 'GitHub', popularity: 98 },
];

export function StatisticsView() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Most Mentioned Skills in Job Postings</CardTitle>
          <CardDescription>Top skills requested by employers on the platform in the last 30 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mentions" fill="#18181b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Freelancer Rate Trends</CardTitle>
          <CardDescription>Average hourly rates by discipline over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis unit="$" />
              <Tooltip formatter={(value: number) => `$${value}/hr`} />
              <Legend />
              <Line type="monotone" dataKey="Development" stroke="#18181b" />
              <Line type="monotone" dataKey="Design" stroke="#71717a" />
              <Line type="monotone" dataKey="Writing" stroke="#a1a1aa" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Popularity of Creative Tools</CardTitle>
          <CardDescription>Percentage of active professionals listing these tools in their skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={toolsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" unit="%" />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="popularity" fill="#18181b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
