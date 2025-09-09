
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Play, Pause, RotateCcw, Plus, Users, Timer as TimerIcon, CheckCircle, Award, ArrowUp, Zap, Hand, User, Video, Mic } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useWorkspace } from "@/context/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { WorkspaceTeam } from "./workspace-team";

type UserType = typeof placeholderUsers[0];

export default function WorkspacesPage() {
    const { 
        time, 
        isActive, 
        sessionType, 
        startSession, 
        endSession, 
        toggleTimer, 
        formatTime,
    } = useWorkspace();

  const [isStartingFlow, setIsStartingFlow] = useState(false);
  const [monthlyFlowHours, setMonthlyFlowHours] = useState(25.5); // Example starting hours
  const monthlyGoal = 50;
  const [isRewardSectionVisible, setIsRewardSectionVisible] = useState(true);
  
  const rewardTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

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


  const handleStartSolo = () => {
    setIsStartingFlow(true);
    setTimeout(() => {
        setIsStartingFlow(false);
        startSession('solo');
    }, 2000);
  };
  
   const handleStartTeam = () => {
    startSession('team');
  };

  const handleEndSessionWrapper = () => {
    const sessionHours = time / 3600;
    setMonthlyFlowHours(prev => prev + sessionHours);
    endSession();
  };

  const handleReset = () => {
    endSession();
  };
  
  const hourlyProgressValue = (time / 3600) * 100; // Calculate progress towards one hour
  const monthlyProgressValue = (monthlyFlowHours / monthlyGoal) * 100;
  const hasReachedGoal = monthlyFlowHours >= monthlyGoal;


  return (
    <div className="relative">
      <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        {sessionType === 'solo' ? (
           <Card className="w-full max-w-2xl">
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
        ) : sessionType === 'team' ? (
          <WorkspaceTeam />
        ) : (
            <div className="flex h-full items-center justify-center">
                <div className="w-full max-w-lg">
                    <header className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight font-headline-tech">WORKSPACES</h1>
                        <p className="mt-1 text-muted-foreground">
                            Your environment for focused work and seamless collaboration.
                        </p>
                    </header>
                    <Tabs defaultValue="solo" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-black text-muted-foreground">
                            <TabsTrigger value="solo">Solo Session</TabsTrigger>
                            <TabsTrigger value="team">Team Session</TabsTrigger>
                        </TabsList>
                        <TabsContent value="solo">
                            <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline-tech">
                                <TimerIcon className="h-6 w-6" />
                                <span>SOLO SESSION</span>
                                </CardTitle>
                                <CardDescription>
                                Start a focused work session to track your productivity.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center gap-8 p-12">
                                <div className="font-mono text-8xl font-bold tracking-tighter">
                                {formatTime(time)}
                                </div>
                                <div className="flex gap-4">
                                    <Button size="lg" className="w-40" onClick={handleStartSolo}>
                                        <Play className="mr-2" />
                                        Start Session
                                    </Button>
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
                        </TabsContent>
                        <TabsContent value="team">
                            <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline-tech">
                                <Users className="h-6 w-6" />
                                <span>TEAM SESSION</span>
                                </CardTitle>
                                <CardDescription>
                                Collaborate with your team in real-time.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-8">
                                <Button size="lg" className="w-full" onClick={handleStartTeam}>
                                    <Plus className="mr-2" />
                                    New Workspace
                                </Button>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">OR</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Input placeholder="Enter workspace code..." />
                                    <Button variant="secondary">Join</Button>
                                </div>
                            </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
