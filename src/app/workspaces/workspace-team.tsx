
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Timer as TimerIcon, Mic, MicOff, Copy, Plus, X, Video, VideoOff, CircleDot, PenSquare, Hand, Lightbulb, Play, Pause, AlertCircle, ScreenShare, ScreenShareOff, PanelLeft, PanelRight, Maximize, Volume2, Ban, UserX } from "lucide-react";
import { WorkspaceChat } from "./chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GlobalSearch } from "@/components/layout/global-search";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


type ParticipantCardProps = {
  user: typeof placeholderUsers[0];
  isRemovable?: boolean;
  onRemove?: (id: string) => void;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  isSpeaking: boolean;
  showAvatars: boolean;
}

function ParticipantCard({ user, isRemovable = false, onRemove, isCameraOn, isScreenSharing, isSpeaking, showAvatars }: ParticipantCardProps) {
  const [isMuted, setIsMuted] = useState(Math.random() > 0.5);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();


  useEffect(() => {
    if (isCameraOn && videoRef.current) {
        // In a real app, you'd get the user's actual media stream.
        // For this placeholder, we just show a black box.
    }
  }, [isCameraOn]);
  
  const handleFullScreen = () => {
    toast({
        title: "Fullscreen Mode",
        description: "This would normally make the video full screen."
    })
  }


  return (
    <div className={cn(
        "relative group/participant aspect-video overflow-hidden rounded-lg bg-muted transition-all duration-300",
        isSpeaking && "ring-2 ring-primary ring-offset-2 ring-offset-background"
    )}>
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
                {showAvatars && <AvatarImage src={user.avatar} className="object-cover" />}
                <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
        </div>
      )}
       {isSpeaking && (
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/50 p-1 pr-2 text-xs text-white">
          <Volume2 className="h-4 w-4" />
        </div>
      )}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover/participant:opacity-100 transition-opacity">
        <p className="truncate text-sm font-medium text-black">{user.name}</p>
        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 left-2 h-7 w-7 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white opacity-0 group-hover/participant:opacity-100 transition-opacity"
        onClick={handleFullScreen}
        >
        <Maximize className="h-4 w-4" />
      </Button>
       {isRemovable && onRemove && (
         <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover/participant:opacity-100 transition-opacity"
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
    const initialParticipants = allUsers.slice(0, 5); // Start with more users to demonstrate layout
    
    const [participants, setParticipants] = useState(initialParticipants);
    const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [hasScreenPermission, setHasScreenPermission] = useState<boolean | null>(null);
    const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
    const [showAvatars, setShowAvatars] = useState(true);


    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);

    // Simulate active speaker change
    useEffect(() => {
        if (participants.length > 1) {
            const interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * participants.length);
                const newSpeakerId = participants[randomIndex].id;
                setActiveSpeakerId(newSpeakerId);
            }, 3000); // Change speaker every 3 seconds
            return () => clearInterval(interval);
        }
    }, [participants]);

    // Reorder participants when active speaker changes
    useEffect(() => {
        if (!activeSpeakerId) return;

        setParticipants(prev => {
            const speakerIndex = prev.findIndex(p => p.id === activeSpeakerId);
            if (speakerIndex === -1 || speakerIndex === 0) return prev; // Not found or already first

            const newParticipants = [...prev];
            const [speaker] = newParticipants.splice(speakerIndex, 1);
            newParticipants.unshift(speaker);
            return newParticipants;
        });

    }, [activeSpeakerId]);

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
        if (participants.length < 15) {
            setParticipants(prev => [...prev, user]);
            toast({ title: "User Invited", description: `${user.name} has been added to the workspace.` });
        } else {
            toast({ variant: "destructive", title: "Workspace Full", description: "You cannot invite more than 15 participants." });
        }
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

    const handleToggleAvatars = () => {
        setShowAvatars(prev => !prev);
        toast({
            title: showAvatars ? "Profile Pictures Hidden" : "Profile Pictures Shown",
        });
    }

    const maxVisibleParticipants = 4;
    const visibleParticipants = participants.slice(0, maxVisibleParticipants);
    const hiddenParticipants = participants.slice(maxVisibleParticipants);


    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card className="flex flex-col">
                    <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Team Workspace</CardTitle>
                        <div className="flex items-center gap-2 font-mono text-lg font-bold">
                        <TimerIcon className="h-5 w-5"/>
                        {formatTime(time)}
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {visibleParticipants.map(user => (
                          <ParticipantCard 
                            key={user.id} 
                            user={user} 
                            isRemovable={user.id !== placeholderUsers[1].id} // Can't remove self
                            onRemove={handleRemove}
                            isCameraOn={isCameraOn && user.id === placeholderUsers[1].id} // Example: only my camera is on
                            isScreenSharing={isScreenSharing && user.id === placeholderUsers[1].id}
                            isSpeaking={user.id === activeSpeakerId}
                            showAvatars={showAvatars}
                          />
                        ))}
                    </div>
                    {hiddenParticipants.length > 0 && (
                        <div className="mt-4 flex items-center gap-4 rounded-md border p-3">
                            <div className="flex -space-x-2 overflow-hidden">
                                <TooltipProvider>
                                {hiddenParticipants.map(user => (
                                    <Tooltip key={user.id}>
                                        <TooltipTrigger asChild>
                                            <Avatar className={cn("h-8 w-8 border-2 border-background", user.id === activeSpeakerId && "ring-2 ring-primary")}>
                                                {showAvatars && <AvatarImage src={user.avatar} />}
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{user.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                                </TooltipProvider>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                +{hiddenParticipants.length} more participant{hiddenParticipants.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                     {hasCameraPermission === false && (
                         <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Camera Access Denied</AlertTitle>
                            <AlertDescription>Please enable camera permissions in your browser settings to use this feature.</AlertDescription>
                        </Alert>
                    )}
                    </CardContent>
                    <CardFooter className="p-2 bg-card">
                         <div className="flex justify-center flex-wrap gap-2 w-full">
                           <Button onClick={onToggleTimer} className={cn("text-xs bg-black hover:bg-gray-800", !isControlsCollapsed && "flex-1 sm:flex-none")}>
                                {isActive ? <Pause /> : <Play />}
                                {!isControlsCollapsed && <span className="ml-2">{isActive ? 'Pause Timer' : 'Resume Timer'}</span>}
                            </Button>
                           <Button variant={isCameraOn ? "secondary" : "default"} onClick={handleToggleCamera} className={cn("text-xs bg-black hover:bg-gray-800", !isControlsCollapsed && "flex-1 sm:flex-none")}>
                                {isCameraOn ? <VideoOff /> : <Video />}
                                {!isControlsCollapsed && <span className="ml-2">{isCameraOn ? 'Turn Off Camera' : 'Use Camera'}</span>}
                            </Button>
                            <Button variant={isScreenSharing ? "secondary" : "default"} onClick={handleToggleScreenShare} className={cn("text-xs bg-black hover:bg-gray-800", !isControlsCollapsed && "flex-1 sm:flex-none")}>
                                {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
                                {!isControlsCollapsed && <span className="ml-2">{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>}
                            </Button>
                           <Button variant={isRecording ? "destructive" : "default"} onClick={handleToggleRecording} className={cn("text-xs bg-black hover:bg-gray-800", !isControlsCollapsed && "flex-1 sm:flex-none")}>
                                <CircleDot />
                                {!isControlsCollapsed && <span className="ml-2">{isRecording ? 'Stop Recording' : 'Record Session'}</span>}
                            </Button>
                             <Separator orientation="vertical" className="h-10 hidden sm:block" />
                            <Button className={cn("text-xs bg-black hover:bg-gray-800", !isControlsCollapsed && "flex-1 sm:flex-none")}>
                                <PenSquare />
                                {!isControlsCollapsed && <span className="ml-2">Whiteboard</span>}
                            </Button>
                             <Button onClick={handleToggleAvatars} className={cn("text-xs bg-black hover:bg-gray-800", !isControlsCollapsed && "flex-1 sm:flex-none")}>
                                <UserX />
                                {!isControlsCollapsed && <span className="ml-2">{showAvatars ? 'Hide Pictures' : 'Show Pictures'}</span>}
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className={cn("text-xs bg-black hover:bg-gray-800", !isControlsCollapsed && "flex-1 sm:flex-none")}>
                                        <Lightbulb />
                                        {!isControlsCollapsed && <span className="ml-2">Pocket Guide</span>}
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
                             <Button size="icon" onClick={() => setIsControlsCollapsed(!isControlsCollapsed)} className="h-auto bg-black hover:bg-gray-800">
                                {isControlsCollapsed ? <PanelRight /> : <PanelLeft />}
                            </Button>
                        </div>
                    </CardFooter>
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
                                                {showAvatars && <AvatarImage src={user.avatar} />}
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
                                        <Button variant="outline" size="sm" onClick={() => handleInvite(user)} disabled={participants.length >= 15}>
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
