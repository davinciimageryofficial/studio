
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Timer as TimerIcon, Mic, MicOff, Copy, Plus, X, Video, VideoOff, CircleDot, PenSquare, Hand, Lightbulb, Play, Pause, AlertCircle, ScreenShare, ScreenShareOff } from "lucide-react";
import { WorkspaceChat } from "./chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GlobalSearch } from "@/components/layout/global-search";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ParticipantCardProps = {
  user: typeof placeholderUsers[0];
  isRemovable?: boolean;
  onRemove?: (id: string) => void;
  isCameraOn: boolean;
  isScreenSharing: boolean;
}

function ParticipantCard({ user, isRemovable = false, onRemove, isCameraOn, isScreenSharing }: ParticipantCardProps) {
  const [isMuted, setIsMuted] = useState(Math.random() > 0.5);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isCameraOn && videoRef.current) {
        // In a real app, you'd get the user's actual media stream.
        // For this placeholder, we just show a black box.
    }
  }, [isCameraOn]);


  return (
    <div className="relative group/participant aspect-video overflow-hidden rounded-lg bg-muted">
      {isScreenSharing ? (
         <div className="w-full h-full flex flex-col items-center justify-center bg-blue-900/20 text-blue-200">
            <ScreenShare className="h-10 w-10" />
            <p className="mt-2 text-sm font-semibold">Presenting</p>
        </div>
      ) : isCameraOn ? (
         <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
            <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} className="object-cover" />
                <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <p className="truncate text-sm font-medium text-black">{user.name}</p>
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
    isActive: boolean;
    formatTime: (seconds: number) => string;
    onToggleTimer: () => void;
    onEndSession: () => void;
}

export function WorkspaceTeam({ time, isActive, formatTime, onToggleTimer, onEndSession }: WorkspaceTeamProps) {
    const allUsers = placeholderUsers;
    const initialParticipants = allUsers.slice(0, 3);
    
    const [participants, setParticipants] = useState(initialParticipants);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [hasScreenPermission, setHasScreenPermission] = useState<boolean | null>(null);

    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);

    const handleToggleCamera = async () => {
        if (!isCameraOn) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setHasCameraPermission(true);
                // In a real app, you would handle the stream for each participant.
                // We'll just enable the visual state here.
                setIsCameraOn(true);
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                setIsCameraOn(false);
            }
        } else {
            setIsCameraOn(false);
        }
    };
    
    const handleToggleScreenShare = async () => {
      if (!isScreenSharing) {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = stream;
          setHasScreenPermission(true);
          setIsScreenSharing(true);
          toast({ title: "Screen sharing started" });
        } catch (error) {
          console.error("Error starting screen share:", error);
          setHasScreenPermission(false);
          setIsScreenSharing(false);
          toast({
            variant: "destructive",
            title: "Screen Share Failed",
            description: "Could not start screen sharing. Please grant permission and try again.",
          });
        }
      } else {
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
          screenStreamRef.current = null;
        }
        setIsScreenSharing(false);
        setHasScreenPermission(null);
        toast({ title: "Screen sharing stopped" });
      }
    };


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

    const handleToggleRecording = () => {
        const newRecordingState = !isRecording;
        setIsRecording(newRecordingState);
        toast({
            title: newRecordingState ? "Recording Started" : "Recording Stopped",
            description: newRecordingState ? "The session is now being recorded." : "The session recording has been saved.",
        });
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
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
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {participants.map(user => (
                          <ParticipantCard 
                            key={user.id} 
                            user={user} 
                            isRemovable={user.id !== placeholderUsers[1].id} // Can't remove self
                            onRemove={handleRemove}
                            isCameraOn={isCameraOn && user.id === placeholderUsers[1].id} // Example: only my camera is on
                            isScreenSharing={isScreenSharing && user.id === placeholderUsers[1].id}
                          />
                        ))}
                    </div>
                     {hasCameraPermission === false && (
                         <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Camera Access Denied</AlertTitle>
                            <AlertDescription>Please enable camera permissions in your browser settings to use this feature.</AlertDescription>
                        </Alert>
                    )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-2">
                        <div className="flex justify-center flex-wrap gap-2">
                           <Button onClick={onToggleTimer} className="flex-1 sm:flex-none text-xs bg-black hover:bg-gray-800">
                                {isActive ? <Pause /> : <Play />}
                                <span className="ml-2">{isActive ? 'Pause Timer' : 'Resume Timer'}</span>
                            </Button>
                           <Button variant={isCameraOn ? "secondary" : "default"} onClick={handleToggleCamera} className="flex-1 sm:flex-none text-xs bg-black hover:bg-gray-800">
                                {isCameraOn ? <VideoOff /> : <Video />}
                                <span className="ml-2">{isCameraOn ? 'Turn Off Camera' : 'Use Camera'}</span>
                            </Button>
                            <Button variant={isScreenSharing ? "secondary" : "default"} onClick={handleToggleScreenShare} className="flex-1 sm:flex-none text-xs bg-black hover:bg-gray-800">
                                {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
                                <span className="ml-2">{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
                            </Button>
                           <Button variant={isRecording ? "destructive" : "default"} onClick={handleToggleRecording} className="flex-1 sm:flex-none text-xs bg-black hover:bg-gray-800">
                                <CircleDot />
                                <span className="ml-2">{isRecording ? 'Stop Recording' : 'Record Session'}</span>
                            </Button>
                             <Separator orientation="vertical" className="h-10 hidden sm:block" />
                            <Button className="flex-1 sm:flex-none text-xs bg-black hover:bg-gray-800">
                                <PenSquare />
                                <span className="ml-2">Whiteboard</span>
                            </Button>
                            <Button className="flex-1 sm:flex-none text-xs bg-black hover:bg-gray-800">
                                <Hand />
                                <span className="ml-2">Gestures</span>
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="flex-1 sm:flex-none text-xs bg-black hover:bg-gray-800">
                                        <Lightbulb />
                                        <span className="ml-2">Pocket Guide</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl h-3/4 flex flex-col p-0">
                                    <div className="p-4 border-b">
                                       <DialogHeader>
                                            <DialogTitle>AI Assistant</DialogTitle>
                                        </DialogHeader>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <GlobalSearch />
                                    </div>
                                </DialogContent>
                            </Dialog>
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

    