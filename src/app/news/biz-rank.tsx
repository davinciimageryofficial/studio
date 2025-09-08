
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const bizRankData = [
  { rank: 1, name: "Innovate Inc.", niche: "Web Development", score: 98.5 },
  { rank: 2, name: "Creative Co.", niche: "UI/UX Design", score: 97.2 },
  { rank: 3, name: "Data Insights", niche: "Data Science", score: 96.8 },
  { rank: 4, name: "Future Labs", niche: "Web Development", score: 95.1 },
  { rank: 5, name: "Pixel Perfect", niche: "UI/UX Design", score: 94.9 },
  { rank: 6, name: "Content Kings", niche: "SEO & Writing", score: 94.5 },
  { rank: 7, name: "Cloud Solutions", niche: "Web Development", score: 93.8 },
  { rank: 8, name: "Neural Networks", niche: "Data Science", score: 92.5 },
  { rank: 9, name: "StoryWeavers", niche: "SEO & Writing", score: 91.9 },
  { rank: 10, name: "Design Sparks", niche: "UI/UX Design", score: 91.2 },
];

const niches = ["All", ...new Set(bizRankData.map(b => b.niche))];

export function BizRankView() {
  const [selectedNiche, setSelectedNiche] = useState("All");

  const filteredBusinesses = selectedNiche === "All"
    ? bizRankData
    : bizRankData.filter(b => b.niche === selectedNiche);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Top Businesses by Niche (Biz-Rank)</CardTitle>
          <CardDescription>A catalogue of the top businesses on the platform, filterable by niche.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 max-w-sm">
             <Select value={selectedNiche} onValueChange={setSelectedNiche}>
              <SelectTrigger>
                <SelectValue placeholder="Select a niche" />
              </SelectTrigger>
              <SelectContent>
                {niches.map(niche => (
                  <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Niche</TableHead>
                <TableHead className="text-right">Biz-Rank Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBusinesses.map(biz => (
                <TableRow key={biz.rank}>
                  <TableCell className="font-bold">{biz.rank}</TableCell>
                  <TableCell>{biz.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{biz.niche}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{biz.score.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
