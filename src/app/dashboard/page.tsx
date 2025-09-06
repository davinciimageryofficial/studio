
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { placeholderUsers } from "@/lib/placeholder-data";
import { ArrowUpRight, Users, Eye, UserPlus, Check, X, Apple, AppWindow, User } from "lucide-react";
import Link from "next/link";
import { EngagementChart } from "./charts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export default function DashboardPage() {
    const [chartType, setChartType] = useState<"bar" | "line" | "area">("area");
    const [isAppDownloaded, setIsAppDownloaded] = useState(false);


    const recentActivities = [
        {
            user: placeholderUsers[2],
            action: "viewed your profile.",
            time: "2 hours ago",
        },
        {
            user: placeholderUsers[3],
            action: "sent you a connection request.",
            time: "1 day ago",
        },
        {
            user: placeholderUsers[4],
            action: "viewed your profile.",
            time: "1 day ago",
        },
        {
            user: placeholderUsers[5],
            action: "accepted your connection request.",
            time: "2 days ago",
        },
    ];
    
    const recentViewers = recentActivities.filter(a => a.action.includes("viewed"));


    const pendingInvitations = placeholderUsers.slice(3, 6);
    const newConnections = placeholderUsers.slice(2, 5);
    
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back, {placeholderUsers[1].name}. Here's a summary of your activity.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stat Cards */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,204</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Recent Viewers</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {recentViewers.map(activity => (
                    <DropdownMenuItem key={activity.user.id} className="flex items-center justify-between gap-2 p-2">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{activity.user.name}</p>
                                <p className="text-xs text-muted-foreground">{activity.user.headline}</p>
                            </div>
                        </div>
                    </DropdownMenuItem>
                ))}
                 <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="#recent-activity" className="w-full justify-center">
                        View all in Recent Activity
                    </Link>
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Connections</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+32</div>
                <p className="text-xs text-muted-foreground">+15 from last month</p>
              </CardContent>
            </Card>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Recent Connections</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {newConnections.map(user => (
                    <DropdownMenuItem key={user.id} className="flex items-center justify-between gap-2 p-2">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.headline}</p>
                            </div>
                        </div>
                    </DropdownMenuItem>
                ))}
                 <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/discover" className="w-full justify-center">
                        View all Connections
                    </Link>
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingInvitations.length}</div>
                        <p className="text-xs text-muted-foreground">{pendingInvitations.length} waiting for your response</p>
                    </CardContent>
                </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Pending Invitations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {pendingInvitations.map(user => (
                    <DropdownMenuItem key={user.id} className="flex items-center justify-between gap-2 p-2">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.headline}</p>
                            </div>
                        </div>
                         <div className="flex gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DropdownMenuItem>
                ))}
                 <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/messages" className="w-full justify-center">
                        View all in Messages
                    </Link>
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Engagement Chart */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Profile Engagement</CardTitle>
                        <CardDescription>A look at your profile views over the last 7 days.</CardDescription>
                    </div>
                    <Tabs defaultValue="area" onValueChange={(value) => setChartType(value as any)} className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                            <TabsTrigger value="bar">Bar</TabsTrigger>
                            <TabsTrigger value="line">Line</TabsTrigger>
                            <TabsTrigger value="area">Area</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <EngagementChart type={chartType} />
            </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card id="recent-activity">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm">
                                    <span className="font-semibold">{activity.user.name}</span> {activity.action}
                                </p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                 <Button variant="outline" className="w-full mt-6">
                    View All Activity
                </Button>
            </CardContent>
        </Card>
      </div>
      
      {!isAppDownloaded && (
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Get Sentry for Desktop</CardTitle>
                    <CardDescription>Experience Sentry on your desktop for a more integrated and focused workflow.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="w-full sm:w-auto" onClick={() => setIsAppDownloaded(true)}>
                        <Apple className="mr-2 h-5 w-5" />
                        Download for Mac
                    </Button>
                    <Button size="lg" className="w-full sm:w-auto" onClick={() => setIsAppDownloaded(true)}>
                        <AppWindow className="mr-2 h-5 w-5" />
                        Download for Windows
                    </Button>
                </CardContent>
            </Card>
        </div>
      )}

    </div>
  );
}
