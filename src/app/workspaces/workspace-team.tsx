
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Timer as TimerIcon, Mic, MicOff, Copy, Plus, X } from "lucide-react";
import { WorkspaceChat } from "./chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

type ParticipantCardProps = {
  user: typeof placeholderUsers[0];
  isRemovable?: boolean;
  onRemove?: (id: string) => void;
}

function ParticipantCard({ user, isRemovable = false, onRemove }: ParticipantCardProps) {
  const [isMuted, setIsMuted] = useState(Math.random() > 0.5);

  return (
    <div className="relative group/participant aspect-square overflow-hidden rounded-lg">
      <Avatar className="h-full w-full rounded-lg">
        <AvatarImage src={user.avatar} className="object-cover" />
        <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <p className="truncate text-xs font-medium text-white">{user.name}</p>
        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>
       {isRemovable && onRemove && (
         <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover/participant:opacity-100 transition-opacity"
            onClick={() => onRemove(user.id)}
          >
            <X className="h-4 w-4" />
          </Button>
       )}
    </div>
  );
}


type WorkspaceTeamProps = {
    time: number;
    formatTime: (seconds: number) => string;
    onEndSession: () => void;
}

export function WorkspaceTeam({ time, formatTime, onEndSession }: WorkspaceTeamProps) {
    const allUsers = placeholderUsers;
    const initialParticipants = allUsers.slice(0, 3);
    
    const [participants, setParticipants] = useState(initialParticipants);
    const { toast } = useToast();

    const onlineUsers = allUsers.filter(u => !participants.some(p => p.id === u.id));

    const handleInvite = (user: typeof placeholderUsers[0]) => {
        setParticipants(prev => [...prev, user]);
        toast({ title: "User Invited", description: `${user.name} has been added to the workspace.` });
    };

    const handleRemove = (userId: string) => {
        const removedUser = participants.find(p => p.id === userId);
        if (removedUser) {
            setParticipants(prev => prev.filter(p => p.id !== userId));
            toast({ title: "User Removed", description: `${removedUser.name} has been removed from the workspace.` });
        }
    };
    
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Invite Link Copied!", description: "You can now share the link with your team." });
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Team Workspace</CardTitle>
                        <div className="flex items-center gap-2 font-mono text-lg font-bold">
                        <TimerIcon className="h-5 w-5"/>
                        {formatTime(time)}
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {participants.map(user => (
                          <ParticipantCard 
                            key={user.id} 
                            user={user} 
                            isRemovable={user.id !== placeholderUsers[1].id} // Can't remove self
                            onRemove={handleRemove}
                          />
                        ))}
                    </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col gap-6">
                <Card>
                    <Tabs defaultValue="invites">
                        <CardHeader>
                            <CardTitle>Manage Team</CardTitle>
                            <TabsList className="grid w-full grid-cols-2 mt-2">
                                <TabsTrigger value="invites">Invite Users</TabsTrigger>
                                <TabsTrigger value="chat">Live Chat</TabsTrigger>
                            </TabsList>
                        </CardHeader>
                        <TabsContent value="invites" className="p-0">
                           <CardContent className="space-y-4 max-h-80 overflow-y-auto">
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
                                        <Button variant="outline" size="sm" onClick={() => handleInvite(user)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Invite
                                        </Button>
                                    </div>
                                ))}
                           </CardContent>
                        </TabsContent>
                         <TabsContent value="chat" className="p-0">
                            <div className="h-[24rem]">
                                <WorkspaceChat />
                            </div>
                        </TabsContent>
                    </Tabs>
                </Card>
                <Button size="lg" onClick={handleCopyLink}>
                    <Copy className="mr-2 h-4 w-4"/>
                    Copy Invite Link
                </Button>
                <Button size="lg" variant="destructive" onClick={onEndSession}>
                    End Session
                </Button>
            </div>
             <Toaster />
        </div>
    )
}
