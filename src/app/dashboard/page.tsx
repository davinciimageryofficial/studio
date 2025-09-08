
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { placeholderUsers } from "@/lib/placeholder-data";
import { ArrowUpRight, Users, Eye, UserPlus, Check, X, AppWindow, User, Zap, Circle, Rocket, GripVertical, ArrowUp, ArrowDown, Minus, LineChart, Settings } from "lucide-react";
import Link from "next/link";
import { EngagementChart } from "./charts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProductivityChart } from "./productivity-chart";

type Task = {
    id: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
};

type TaskStatus = 'todo' | 'inProgress' | 'done';

const initialTasks: { [key in TaskStatus]: Task[] } = {
  todo: [
    { id: 'task-1', title: 'Draft Q3 marketing brief for the new feature launch', priority: 'High' },
    { id: 'task-2', title: 'Design new homepage mockups in Figma', priority: 'Medium' },
    { id: 'task-3', title: 'Schedule user testing sessions for the checkout flow', priority: 'Medium' },
  ],
  inProgress: [
    { id: 'task-4', title: 'Develop user authentication flow with NextAuth.js', priority: 'High' },
    { id: 'task-5', title: 'Write blog post on "The Future of AI in Creative Work"', priority: 'Low' },
  ],
  done: [
    { id: 'task-6', title: 'Deploy serverless API endpoint for the new analytics service', priority: 'High' },
    { id: 'task-7', title: 'Onboard new design intern and set up their accounts', priority: 'Medium' },
    { id: 'task-8', title: 'Finalize and send invoices for May projects', priority: 'High' },
  ],
};

const priorityIcons = {
  High: <ArrowUp className="h-4 w-4 text-red-600" />,
  Medium: <Minus className="h-4 w-4 text-yellow-600" />,
  Low: <ArrowDown className="h-4 w-4 text-green-600" />,
};

type VisibleMetrics = {
    revenue: boolean;
    projects: boolean;
    impressions: boolean;
    acquisition: boolean;
    revPerProject: boolean;
}

export default function DashboardPage() {
    const [chartType, setChartType] = useState<"bar" | "line" | "area">("area");
    const [isAppDownloaded, setIsAppDownloaded] = useState(false);
    const [accessCode, setAccessCode] = useState("");
    const [tasks, setTasks] = useState(initialTasks);
    const { toast } = useToast();
    const router = useRouter();
    const [productivityTimeline, setProductivityTimeline] = useState<"daily" | "weekly" | "monthly">("monthly");
    const [visibleMetrics, setVisibleMetrics] = useState<VisibleMetrics>({
        revenue: true,
        projects: true,
        impressions: true,
        acquisition: true,
        revPerProject: true,
    });


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
    
    const handleAccessCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessCode === '2004') {
            toast({
                title: "Access Granted!",
                description: "Welcome to the AD-Sentry Studio.",
            });
            router.push('/ad-studio');
        } else {
            toast({
                variant: "destructive",
                title: "Invalid Code",
                description: "The access code you entered is incorrect. Please try again.",
            });
        }
    };
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, sourceColumn: TaskStatus) => {
        e.dataTransfer.setData("taskId", taskId);
        e.dataTransfer.setData("sourceColumn", sourceColumn);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, destinationColumn: TaskStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        const sourceColumn = e.dataTransfer.getData("sourceColumn") as TaskStatus;

        if (sourceColumn === destinationColumn) return;

        let taskToMove: Task | undefined;
        
        // Find and remove task from source column
        const newSourceTasks = tasks[sourceColumn].filter(task => {
            if (task.id === taskId) {
                taskToMove = task;
                return false;
            }
            return true;
        });

        if (taskToMove) {
            // Add task to destination column
            const newDestinationTasks = [...tasks[destinationColumn], taskToMove];
            
            setTasks(prevTasks => ({
                ...prevTasks,
                [sourceColumn]: newSourceTasks,
                [destinationColumn]: newDestinationTasks,
            }));
        }
    };
    
    const handleMetricVisibilityChange = (metric: keyof VisibleMetrics, checked: boolean) => {
        setVisibleMetrics(prev => ({ ...prev, [metric]: checked }));
    };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back, {placeholderUsers[1].name}. Here's a summary of your activity.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
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
                                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
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
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                 <div className="flex-1">
                    <CardTitle className="text-sm font-medium">New Connections</CardTitle>
                 </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
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
                                 <AvatarImage src={user.avatar} alt={user.name} />
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
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="flex-1">
                            <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
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
                                 <AvatarImage src={user.avatar} alt={user.name} />
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
                    <Link href="/messages" className="w-full justify-center">
                        View all in Messages
                    </Link>
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

       <div className="mt-12">
            <header className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">Task Board</h2>
              <p className="text-muted-foreground">A minimalist, grid-aligned view of your project progress.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(Object.keys(tasks) as TaskStatus[]).map((status) => (
                <div 
                    key={status}
                    onDrop={(e) => handleDrop(e, status)}
                    onDragOver={handleDragOver}
                    className="space-y-3"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-2">{status.replace(/([A-Z])/g, ' $1')}</h3>
                  <div className="space-y-3">
                    {tasks[status].map(task => (
                      <div 
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id, status)}
                          className="group cursor-grab border-b bg-card p-4 transition-shadow hover:shadow-md"
                      >
                          <p className="text-sm font-medium pr-2 mb-4">{task.title}</p>
                          <div className="flex items-center justify-between">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button className="flex items-center gap-2 text-muted-foreground">
                                        {priorityIcons[task.priority]}
                                        <span className="text-xs font-medium">{task.priority}</span>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{task.priority} Urgency</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                          </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        
        <Card className="mt-8">
            <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-6 w-6" />
                        Productivity
                    </CardTitle>
                    <CardDescription>
                        A consolidated view of your key professional metrics.
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Tabs defaultValue="monthly" onValueChange={(value) => setProductivityTimeline(value as any)} className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                            <TabsTrigger value="daily">Daily</TabsTrigger>
                            <TabsTrigger value="weekly">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Toggle Metrics</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.keys(visibleMetrics).map((key) => (
                                <DropdownMenuCheckboxItem
                                    key={key}
                                    checked={visibleMetrics[key as keyof VisibleMetrics]}
                                    onCheckedChange={(checked) => handleMetricVisibilityChange(key as keyof VisibleMetrics, !!checked)}
                                >
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
            </CardHeader>
            <CardContent>
                <ProductivityChart timeline={productivityTimeline} visibleMetrics={visibleMetrics} />
            </CardContent>
        </Card>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="text-primary" />AD-Sentry</CardTitle>
                <CardDescription>Launch and manage AI-powered ad programs to promote your profile or services.</CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="lg" className="w-full sm:w-auto">Launch Ad Studio</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ad Studio Early Access</DialogTitle>
                            <DialogDescription>
                                The full AD-Sentry studio is currently in a private beta. Enter an access code to get early access.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAccessCodeSubmit}>
                             <div className="space-y-2 py-4">
                                <Label htmlFor="access-code">Beta Access Code</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        id="access-code"
                                        placeholder="Enter your code" 
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                    />
                                    <Button type="submit">
                                        <Rocket className="mr-2 h-4 w-4" />
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Download Sentry</CardTitle>
                <CardDescription>Get the full desktop experience for maximum productivity.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
                <Dialog open={isAppDownloaded} onOpenChange={setIsAppDownloaded}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="w-full" variant="outline" onClick={() => setIsAppDownloaded(true)}>
                            <Circle className="mr-2 h-5 w-5" />
                            Download for Mac
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Download Started</DialogTitle>
                        <DialogDescription>
                            Your download for the Sentry Mac app has started. Check your downloads folder.
                        </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                 <Dialog open={isAppDownloaded} onOpenChange={setIsAppDownloaded}>
                     <DialogTrigger asChild>
                        <Button size="lg" className="w-full" variant="outline" onClick={() => setIsAppDownloaded(true)}>
                            <AppWindow className="mr-2 h-5 w-5" />
                            Download for Windows
                        </Button>
                    </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Download Started</DialogTitle>
                        <DialogDescription>
                            Your download for the Sentry Windows app has started. Check your downloads folder.
                        </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

    

    
