
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Play, Pause, RotateCcw, Plus, Users, Timer as TimerIcon, CheckCircle, Award, ArrowUp, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkspaceTeam } from "./workspace-team";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useWorkspace } from "@/context/workspace-context";

type User = typeof placeholderUsers[0];

export default function WorkspacesPage() {
    const { 
        time, 
        isActive, 
        sessionType, 
        startSession, 
        endSession, 
        toggleTimer, 
        formatTime
    } = useWorkspace();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStartingFlow, setIsStartingFlow] = useState(false);
  const [monthlyFlowHours, setMonthlyFlowHours] = useState(25.5); // Example starting hours
  const monthlyGoal = 50;
  const [isRewardSectionVisible, setIsRewardSectionVisible] = useState(true);
  
  const rewardTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onlineUsers = placeholderUsers.slice(0, 5);
  

  useEffect(() => {
    if (sessionType === 'solo' && !isStartingFlow) {
      setIsRewardSectionVisible(true); // Reset on new session start
      rewardTimerRef.current = setTimeout(() => {
        setIsRewardSectionVisible(false);
      }, 30000); // 30 seconds
    }
    
    return () => {
      if (rewardTimerRef.current) {
        clearTimeout(rewardTimerRef.current);
      }
    };
  }, [sessionType, isStartingFlow]);


  const handleStart = (type: "solo" | "team", initialParticipant: User | null = null) => {
    if (type === 'solo') {
        setIsStartingFlow(true);
        setTimeout(() => {
            setIsStartingFlow(false);
            startSession(type);
        }, 2000);
    } else {
        startSession(type, initialParticipant ? [placeholderUsers[1], initialParticipant] : undefined);
    }
    setIsDialogOpen(false);
  };
  
  const handleEndSessionWrapper = () => {
    const sessionHours = time / 3600;
    setMonthlyFlowHours(prev => prev + sessionHours);
    endSession();
  }

  const handleReset = () => {
    // This local reset is fine as it's for the non-session state
    endSession();
  };

  const hourlyProgressValue = (time / 3600) * 100; // Calculate progress towards one hour
  const monthlyProgressValue = (monthlyFlowHours / monthlyGoal) * 100;
  const hasReachedGoal = monthlyFlowHours >= monthlyGoal;


  return (
    <div className="relative h-full min-h-screen">
      <div className="p-4 sm:p-6 md:p-8">
        {sessionType === 'solo' && (
           <Card>
              <CardHeader className="text-center">
                <CardTitle>Solo Focus Session</CardTitle>
                <CardDescription>You are in a solo session. Keep up the great work!</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-8 p-12">
                  {isStartingFlow ? (
                        <div className="text-center animate-in fade-in-0 zoom-in-95 duration-500">
                             <h2 className="text-2xl font-bold tracking-widest text-primary animate-pulse">
                                FLOW STATE
                            </h2>
                            <p className="text-muted-foreground">CONFIRMED</p>
                        </div>
                  ) : (
                    <>
                        <div className="w-full max-w-full space-y-6">
                            <div className="font-mono text-8xl font-bold tracking-tighter text-center">
                                {formatTime(time)}
                            </div>
                            <div className="w-full">
                                <Progress value={hourlyProgressValue} />
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>Session Goal</span>
                                    <span>1:00:00</span>
                                </div>
                            </div>
                            
                            {/* Monthly Reward Tracker */}
                            <div className={cn(
                                "w-full pt-4 space-y-3 transition-all duration-500 ease-in-out",
                                isRewardSectionVisible ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden"
                            )}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Award className="h-5 w-5" />
                                    <span className="font-medium">Monthly Flow Reward</span>
                                  </div>
                                   <span className="text-sm font-bold">{monthlyFlowHours.toFixed(1)} / {monthlyGoal} hrs</span>
                                </div>
                                {hasReachedGoal ? (
                                    <div className="flex items-center gap-2 rounded-md border border-green-500 bg-green-500/10 p-3 text-sm font-semibold text-green-700 dark:text-green-400">
                                        <CheckCircle className="h-5 w-5" />
                                        <span>Congratulations! You've earned a discount for next month.</span>
                                    </div>
                                ) : (
                                   <Progress value={monthlyProgressValue} />
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Reach {monthlyGoal} hours of "flow state" per month to get a discount on your subscription.
                                </p>
                            </div>
                        </div>


                        <div className="flex justify-center gap-4 mt-4">
                            <Button size="lg" onClick={toggleTimer}>
                            {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                            {isActive ? 'Pause' : 'Resume'}
                            </Button>
                            <Button size="lg" variant="destructive" onClick={handleEndSessionWrapper}>
                                End Session
                            </Button>
                        </div>
                    </>
                  )}
              </CardContent>
               {!isStartingFlow && (
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute bottom-4 right-4 text-muted-foreground hover:bg-muted"
                                onClick={() => setIsRewardSectionVisible(!isRewardSectionVisible)}
                            >
                                <ArrowUp className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Toggle Monthly Reward Tracker</p>
                        </TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
               )}
            </Card>
        )}
        {sessionType === 'team' && (
          <WorkspaceTeam />
        )}
        {!sessionType && (
            <div className="flex h-full items-center justify-center">
                <div className="w-full max-w-4xl">
                    <header className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
                        <p className="mt-1 text-muted-foreground">
                            Your focused environment for deep work and collaboration.
                        </p>
                    </header>

                    <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline-tech">
                            <TimerIcon className="h-6 w-6" />
                            <span>SESSION</span>
                            </CardTitle>
                            <CardDescription>
                            Start a focused work session, solo or with your team.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center gap-8 p-12">
                            <div className="font-mono text-8xl font-bold tracking-tighter">
                            {formatTime(time)}
                            </div>
                            <div className="flex gap-4">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="lg" className="w-40">
                                        <Play className="mr-2" />
                                        Start Session
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Choose your workspace</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
                                        <Button variant="outline" className="h-auto flex flex-col items-start justify-start text-left gap-2 p-6" onClick={() => handleStart('solo')}>
                                            <Users className="h-8 w-8" />
                                            <span className="font-semibold">Start Solo Session</span>
                                            <span className="text-xs text-muted-foreground font-normal normal-case text-balance">Work by yourself in a focused environment.</span>
                                        </Button>
                                        <Button variant="outline" className="h-auto flex flex-col items-start justify-start text-left gap-2 p-6" onClick={() => handleStart('team')}>
                                            <Users className="h-8 w-8" />
                                            <span className="font-semibold">Create Team Workspace</span>
                                            <span className="text-xs text-muted-foreground font-normal normal-case text-balance">Invite colleagues to collaborate in real-time.</span>
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleReset}
                                disabled={time === 0 && !isActive}
                            >
                                <RotateCcw className="mr-2" />
                                Reset
                            </Button>
                            </div>
                        </CardContent>
                        </Card>
                    </div>

                    <aside className="space-y-8">
                        <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-6 w-6" />
                                <span>Online Users</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {onlineUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{user.name}</p>
                                                <div className="flex items-center gap-1.5">
                                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                                <p className="text-xs text-muted-foreground">Online</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleStart('team', user)}>
                                            <Plus className="h-5 w-5" />
                                            <span className="sr-only">Invite {user.name}</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        </Card>
                    </aside>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

    