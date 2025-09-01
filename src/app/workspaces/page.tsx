
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Play, Pause, RotateCcw, Plus, Users, Timer as TimerIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkspaceTeam } from "./workspace-team";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

type SessionType = "solo" | "team" | null;

function FlowStateOverlay({ isVisible, isFadingOut }: { isVisible: boolean, isFadingOut: boolean }) {
    if (!isVisible) return null;
    return (
        <div 
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
                isFadingOut ? 'fade-out' : 'fade-in'
            )}
        >
            <div className={cn(
                "rounded-lg bg-background p-8 shadow-2xl border text-center",
                isFadingOut ? 'animate-out fade-out-0 zoom-out-95' : 'animate-in fade-in-0 zoom-in-95'
            )}>
                 <h2 className="text-2xl font-bold tracking-widest text-primary animate-pulse">
                    FLOW STATE
                </h2>
                <p className="text-muted-foreground">CONFIRMED</p>
            </div>
        </div>
    );
}

export default function WorkspacesPage() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFlowStateVisible, setIsFlowStateVisible] = useState(false);
  const [isFlowStateFadingOut, setIsFlowStateFadingOut] = useState(false);


  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onlineUsers = placeholderUsers.slice(0, 5);
  
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);


  const handleStart = (type: SessionType) => {
    if (type === 'solo') {
        setIsFlowStateVisible(true);
        setIsFlowStateFadingOut(false);

        setTimeout(() => {
            setIsFlowStateFadingOut(true);
        }, 1500); // Start fading out after 1.5s

        setTimeout(() => {
            setIsFlowStateVisible(false);
        }, 2000); // Remove from DOM after 2s total
    }
    setSessionType(type);
    setIsActive(true);
    setIsDialogOpen(false);
  };
  
  const handleToggleTimer = () => {
    setIsActive(!isActive);
  }

  const handleEndSession = () => {
    setIsActive(false);
    setSessionType(null);
    setTime(0);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  const progressValue = (time / 3600) * 100; // Calculate progress towards one hour

  return (
    <div className="relative h-full min-h-screen">
      <FlowStateOverlay isVisible={isFlowStateVisible} isFadingOut={isFlowStateFadingOut} />
      <div className={cn("p-4 sm:p-6 md:p-8", isFlowStateVisible && "blur-sm")}>
        {sessionType === 'solo' && (
           <Card>
              <CardHeader className="text-center">
                <CardTitle>Solo Focus Session</CardTitle>
                <CardDescription>You are in a solo session. Keep up the great work!</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-8 p-12">
                  <div className="w-full space-y-4">
                    <div className="font-mono text-8xl font-bold tracking-tighter text-center">
                        {formatTime(time)}
                    </div>
                    <Progress value={progressValue} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>00:00:00</span>
                        <span>1:00:00</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button size="lg" onClick={handleToggleTimer}>
                      {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                      {isActive ? 'Pause' : 'Resume'}
                    </Button>
                    <Button size="lg" variant="destructive" onClick={handleEndSession}>
                        End Session
                    </Button>
                  </div>
              </CardContent>
            </Card>
        )}
        {sessionType === 'team' && (
          <WorkspaceTeam 
            time={time}
            isActive={isActive}
            formatTime={formatTime}
            onToggleTimer={handleToggleTimer}
            onEndSession={handleEndSession}
          />
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
                            <CardTitle className="flex items-center gap-2">
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
                                        <Button variant="ghost" size="icon" disabled>
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
