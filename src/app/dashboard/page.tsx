
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, Users, Eye, UserPlus, Check, AppWindow, User, Zap, Circle, Rocket, GripVertical, ArrowUp, ArrowDown, Minus, LineChart, Settings, Gift, Building, MoreHorizontal, Edit, Trash2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProductivityChart } from "./productivity-chart";
import { Slider } from "@/components/ui/slider";
import { ClientOnly } from "@/components/layout/client-only";
import { AgencyMetrics } from "./agency-metrics";
import { OperationalCharts } from "./operational-charts";
import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";
import { ProfileEngagementChart } from "./profile-engagement-chart";
import { getCurrentUser, getUsers, getAgencyDashboardMetrics, getAgencyMetrics, getPersonalDashboardMetrics } from "@/lib/database";
import { Skeleton } from "@/components/ui/skeleton";
import type { User as UserType } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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

type VisibleEngagementMetrics = {
    views: boolean;
    connections: boolean;
    searches: boolean;
    likes: boolean;
    skillSyncNetMatches: boolean;
}

function TaskDialog({ task, onSave, triggerButton, column }: { task?: Task, onSave: (task: Task) => void, triggerButton: React.ReactNode, column: TaskStatus }) {
    const [title, setTitle] = useState(task?.title || "");
    const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'Medium');
    const isEditing = !!task;

    const handleSave = () => {
        if (title.trim()) {
            onSave({
                id: task?.id || `task-${Date.now()}`,
                title: title.trim(),
                priority,
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="task-title">Title</Label>
                        <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="task-priority">Priority</Label>
                        <Select value={priority} onValueChange={(value: Task['priority']) => setPriority(value)}>
                            <SelectTrigger id="task-priority">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                    <DialogClose asChild>
                        <Button onClick={handleSave} disabled={!title.trim()}>
                            {isEditing ? 'Save Changes' : 'Add Task'}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


function DashboardPageInternal() {
    const { language } = useLanguage();
    const t = translations[language];
    const [isAppDownloaded, setIsAppDownloaded] = useState(false);
    const [accessCode, setAccessCode] = useState("");
    const [tasks, setTasks] = useState(initialTasks);
    const { toast } = useToast();
    const router = useRouter();
    const [productivityTimeline, setProductivityTimeline] = useState<"daily" | "weekly" | "monthly">("monthly");
    const [engagementTimeline, setEngagementTimeline] = useState<"daily" | "weekly" | "monthly">("daily");
    const [visibleMetrics, setVisibleMetrics] = useState<VisibleMetrics>({
        revenue: true,
        projects: true,
        impressions: true,
        acquisition: true,
        revPerProject: false,
    });
    const [visibleEngagementMetrics, setVisibleEngagementMetrics] = useState<VisibleEngagementMetrics>({
        views: true,
        connections: true,
        searches: true,
        likes: true,
        skillSyncNetMatches: true,
    });
    const [productivityChartScale, setProductivityChartScale] = useState(1);
    const [tempProductivityChartScale, setTempProductivityChartScale] = useState(1);

    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [otherUsers, setOtherUsers] = useState<UserType[]>([]);
    const [dashboardMetrics, setDashboardMetrics] = useState({ teamRevenue: 0, totalProjects: 0, clientAcquisition: 0 });
    const [personalMetrics, setPersonalMetrics] = useState({ profileViews: 0, newConnections: 0, pendingInvitations: 0, profileViewsChange: 0, newConnectionsChange: 0 });
    const [agencyMetrics, setAgencyMetrics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);

                if (!user) {
                    // If no user, we can't fetch the rest of the data.
                    setIsLoading(false);
                    return;
                }

                const [others, dashMetrics, personalDashMetrics, agencyMetricsData] = await Promise.all([
                    getUsers(),
                    getAgencyDashboardMetrics(),
                    getPersonalDashboardMetrics(),
                    getAgencyMetrics(),
                ]);
                
                setOtherUsers(others.filter(o => o.id !== user.id));
                setDashboardMetrics(dashMetrics);
                setPersonalMetrics(personalDashMetrics);
                setAgencyMetrics(agencyMetricsData);

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                toast({
                    title: "Error",
                    description: "Could not load dashboard data.",
                    variant: "destructive"
                })
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [toast]);


    // Memos for derived data, now using live 'otherUsers'
    const recentActivities = useMemo(() => {
        if (otherUsers.length < 4) return [];
        return [
            { user: otherUsers[0], action: "viewed your profile.", time: "2 hours ago" },
            { user: otherUsers[1], action: "sent you a connection request.", time: "1 day ago" },
            { user: otherUsers[2], action: "viewed your profile.", time: "1 day ago" },
            { user: otherUsers[3], action: "accepted your connection request.", time: "2 days ago" },
        ];
    }, [otherUsers]);
    
    const recentViewers = useMemo(() => recentActivities.filter(a => a.action.includes("viewed")), [recentActivities]);
    const pendingInvitationsList = useMemo(() => otherUsers.slice(1, 4), [otherUsers]);
    const newConnectionsList = useMemo(() => otherUsers.slice(0, 3), [otherUsers]);
    
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
        
        const newSourceTasks = tasks[sourceColumn].filter(task => {
            if (task.id === taskId) {
                taskToMove = task;
                return false;
            }
            return true;
        });

        if (taskToMove) {
            const newDestinationTasks = [...tasks[destinationColumn], taskToMove];
            
            setTasks(prevTasks => ({
                ...prevTasks,
                [sourceColumn]: newSourceTasks,
                [destinationColumn]: newDestinationTasks,
            }));
        }
    };

    const handleSaveTask = (updatedTask: Task, column: TaskStatus) => {
        const columnTasks = tasks[column];
        const taskExists = columnTasks.some(t => t.id === updatedTask.id);

        if (taskExists) {
            // Edit existing task
            setTasks(prev => ({
                ...prev,
                [column]: prev[column].map(t => t.id === updatedTask.id ? updatedTask : t),
            }));
        } else {
            // Add new task
            setTasks(prev => ({
                ...prev,
                [column]: [...prev[column], updatedTask],
            }));
        }
    };

    const handleDeleteTask = (taskId: string, column: TaskStatus) => {
        setTasks(prev => ({
            ...prev,
            [column]: prev[column].filter(t => t.id !== taskId),
        }));
    };
    
    const handleMetricVisibilityChange = (metric: keyof VisibleMetrics, checked: boolean) => {
        setVisibleMetrics(prev => ({ ...prev, [metric]: checked }));
    };

    const handleEngagementMetricVisibilityChange = (metric: keyof VisibleEngagementMetrics, checked: boolean) => {
        setVisibleEngagementMetrics(prev => ({ ...prev, [metric]: checked }));
    };
    
    const getActivityIcon = (action: string) => {
        if (action.includes('viewed')) return <Eye className="h-4 w-4" />;
        if (action.includes('sent')) return <UserPlus className="h-4 w-4 text-blue-500" />;
        if (action.includes('accepted')) return <Check className="h-4 w-4 text-green-500" />;
        return <User className="h-4 w-4" />;
    };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        {isLoading || !currentUser ? (
            <div className="space-y-2">
                <Skeleton className="h-9 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
            </div>
        ) : (
            <>
                <h1 className="text-3xl font-bold tracking-tight">{t.dashboardTitle}</h1>
                <p className="mt-1 text-muted-foreground">
                    {t.dashboardWelcome.replace('{name}', currentUser?.name || 'Guest')}
                </p>
            </>
        )}
      </header>

      <Tabs defaultValue="personal">
        <div className="flex justify-end mb-6">
            <TabsList className="bg-black text-muted-foreground">
                <TabsTrigger value="personal">{t.personalMode}</TabsTrigger>
                <TabsTrigger value="agency">{t.agencyMode}</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="personal">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stat Cards */}
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium">{t.profileViews}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80" align="end">
                        <DropdownMenuLabel>{t.recentViewers}</DropdownMenuLabel>
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
                                {t.viewAllRecent}
                            </Link>
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{personalMetrics.profileViews.toLocaleString()}</div>}
                     <p className="text-xs text-muted-foreground">
                        {personalMetrics.profileViewsChange >= 0 ? '+' : ''}{personalMetrics.profileViewsChange.toFixed(1)}% {t.fromLastMonth}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                     <div className="flex-1">
                        <CardTitle className="text-sm font-medium">{t.newConnections}</CardTitle>
                     </div>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-80" align="end">
                        <DropdownMenuLabel>{t.recentConnections}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {newConnectionsList.map(user => (
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
                                {t.viewAllConnections}
                            </Link>
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">+{personalMetrics.newConnections}</div>}
                    <p className="text-xs text-muted-foreground">
                         {personalMetrics.newConnectionsChange >= 0 ? '+' : ''}{personalMetrics.newConnectionsChange.toFixed(1)}% {t.fromLastMonth}
                    </p>
                  </CardContent>
                </Card>

                 <Card>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="flex-1">
                            <CardTitle className="text-sm font-medium">{t.pendingInvitations}</CardTitle>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-80" align="end">
                            <DropdownMenuLabel>{t.pendingInvitations}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {pendingInvitationsList.map(user => (
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
                                    {t.viewAllMessages}
                                </Link>
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{personalMetrics.pendingInvitations}</div>}
                        <p className="text-xs text-muted-foreground">{personalMetrics.pendingInvitations > 0 ? t.waitingResponse.replace('{count}', String(personalMetrics.pendingInvitations)) : "No pending invitations"}</p>
                    </CardContent>
                </Card>
              </div>

               <div className="mt-6">
                    <header className="mb-6">
                      <h2 className="text-2xl font-semibold tracking-tight">{t.taskBoardTitle}</h2>
                      <p className="text-muted-foreground">{t.taskBoardDescription}</p>
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
                                  <div className="flex items-start justify-between">
                                      <p className="text-sm font-medium pr-2 flex-1">{task.title}</p>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <TaskDialog
                                              task={task}
                                              onSave={(updatedTask) => handleSaveTask(updatedTask, status)}
                                              column={status}
                                              triggerButton={
                                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                                      <Edit className="h-4 w-4" />
                                                  </Button>
                                              }
                                          />
                                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteTask(task.id, status)}>
                                              <Trash2 className="h-4 w-4" />
                                          </Button>
                                      </div>
                                  </div>
                                  <div className="flex items-center justify-between mt-4">
                                    <ClientOnly>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <button className="flex items-center gap-2 text-muted-foreground">
                                                    {priorityIcons[task.priority]}
                                                    <span className="text-xs font-medium">{task.priority} Urgency</span>
                                                  </button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>{task.priority} Urgency</p></TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </ClientOnly>
                                  </div>
                              </div>
                            ))}
                          </div>
                           <TaskDialog
                                onSave={(newTask) => handleSaveTask(newTask, status)}
                                column={status}
                                triggerButton={
                                    <Button variant="outline" className="w-full mt-2">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Task
                                    </Button>
                                }
                           />
                        </div>
                      ))}
                    </div>
                  </div>
                
                <Card className="mt-8">
                    <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <LineChart className="h-6 w-6" />
                                {t.productivityTitle}
                            </CardTitle>
                            <CardDescription>
                                {t.productivityDescription}
                            </CardDescription>
                        </div>
                         <div className="flex items-center gap-2">
                            <div className="w-32 space-y-1">
                                <Label htmlFor="productivity-scale" className="text-xs">{t.scale} ({tempProductivityChartScale.toFixed(1)}x)</Label>
                                <Slider 
                                    id="productivity-scale"
                                    min={0.1}
                                    max={5}
                                    step={0.1}
                                    value={[tempProductivityChartScale]}
                                    onValueChange={(value) => setTempProductivityChartScale(value[0])}
                                    onValueCommit={(value) => setProductivityChartScale(value[0])}
                                />
                            </div>
                            <Tabs defaultValue="monthly" onValueChange={(value) => setProductivityTimeline(value as any)} className="w-full sm:w-auto">
                                <TabsList className="grid w-full grid-cols-3 sm:w-auto bg-black text-muted-foreground">
                                    <TabsTrigger value="daily">{t.daily}</TabsTrigger>
                                    <TabsTrigger value="weekly">{t.weekly}</TabsTrigger>
                                    <TabsTrigger value="monthly">{t.monthly}</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="default" size="icon" className="bg-black text-white">
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t.toggleMetrics}</DropdownMenuLabel>
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
                        <ProductivityChart timeline={productivityTimeline} visibleMetrics={visibleMetrics} scale={productivityChartScale} />
                    </CardContent>
                </Card>

                <div className="mt-8">
                    <ProfileEngagementChart 
                        timeline={engagementTimeline}
                        onTimelineChange={setEngagementTimeline}
                        visibleMetrics={visibleEngagementMetrics}
                        onMetricVisibilityChange={handleEngagementMetricVisibilityChange}
                    />
                </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Activity */}
                <Card id="recent-activity" className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{t.recentActivity}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                        {getActivityIcon(activity.action)}
                                    </div>
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
                            {t.viewAllActivity}
                        </Button>
                    </CardContent>
                </Card>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gift className="text-primary" /> {t.referFriendTitle}</CardTitle>
                        <CardDescription>{t.referFriendDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/billing?tab=referrals">
                            <Button size="lg">{t.getReferralLink}</Button>
                        </Link>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Zap className="text-primary" />{t.adSentryTitle}</CardTitle>
                        <CardDescription>{t.adSentryDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="lg">{t.launchAdStudio}</Button>
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
              </div>
              
              <Card className="mt-8">
                <CardHeader>
                    <CardTitle>{t.downloadSentryTitle}</CardTitle>
                    <CardDescription>{t.downloadSentryDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Dialog open={isAppDownloaded} onOpenChange={setIsAppDownloaded}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="w-full" variant="outline" onClick={() => setIsAppDownloaded(true)}>
                                <Circle className="mr-2 h-5 w-5" />
                                {t.forMac}
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
                                {t.forWindows}
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
        </TabsContent>
        <TabsContent value="agency">
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t.teamRevenue}</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">${dashboardMetrics.teamRevenue.toLocaleString()}</div>}
                            <p className="text-xs text-muted-foreground">Total revenue generated by the team.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t.totalProjects}</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{dashboardMetrics.totalProjects}</div>}
                            <p className="text-xs text-muted-foreground">Total projects across the agency.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t.clientAcquisition}</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">+{dashboardMetrics.clientAcquisition}</div>}
                            <p className="text-xs text-muted-foreground">New clients this quarter.</p>
                        </CardContent>
                    </Card>
                </div>
                 <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader className="px-0">
                        <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" /> {t.teamProductivity}</CardTitle>
                        <CardDescription>{t.teamProductivityDesc}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                         <AgencyMetrics metrics={agencyMetrics} isLoading={isLoading} />
                    </CardContent>
                </Card>
                <OperationalCharts />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DashboardPage() {
    return (
        <ClientOnly>
            <DashboardPageInternal />
        </ClientOnly>
    )
}

    

    

    