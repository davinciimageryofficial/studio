
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Play, Pause, RotateCcw, Plus, Users, Timer as TimerIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkspaceTeam } from "./workspace-team";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

type SessionType = "solo" | "team" | null;

export default function WorkspacesPage() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    setSessionType(type);
    setIsActive(true);
    setIsDialogOpen(false);
  };

  const handleEndSession = () => {
    setIsActive(false);
    setSessionType(null);
    setTime(0);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  if (isActive) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        {sessionType === 'solo' && (
           <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Solo Focus Session</CardTitle>
                  <div className="flex items-center gap-2 font-mono text-lg font-bold">
                    <TimerIcon className="h-5 w-5"/>
                    {formatTime(time)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                 <p className="text-muted-foreground mb-4">You are in a solo session. Keep up the great work!</p>
                 <Button size="lg" variant="destructive" onClick={handleEndSession}>
                    End Session
                </Button>
              </CardContent>
            </Card>
        )}
        {sessionType === 'team' && (
          <WorkspaceTeam 
            time={time} 
            formatTime={formatTime} 
            onEndSession={handleEndSession} 
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-screen">
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <header className="mb-8">
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
                <span>Session Timer</span>
                </CardTitle>
                <CardDescription>
                Start the timer to begin your focused work session.
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
                            <Button variant="outline" className="h-auto flex-col gap-2 p-6" onClick={() => handleStart('solo')}>
                                <Users className="h-8 w-8" />
                                <span className="font-semibold">Start Solo Session</span>
                                <span className="text-xs text-muted-foreground">Work by yourself in a focused environment.</span>
                            </Button>
                             <Button variant="outline" className="h-auto flex-col gap-2 p-6" onClick={() => handleStart('team')}>
                                <Users className="h-8 w-8" />
                                <span className="font-semibold">Create Team Workspace</span>
                                <span className="text-xs text-muted-foreground">Invite colleagues to collaborate in real-time.</span>
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
      </main>
    </div>
  );
}
