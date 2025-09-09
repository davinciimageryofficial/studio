
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Timer as TimerIcon, Mic, MicOff, Copy, Plus, X, Video, VideoOff, CircleDot, PenSquare, Hand, Lightbulb, Play, Pause, AlertCircle, ScreenShare, ScreenShareOff, PanelLeft, PanelRight, Maximize, Volume2, Ban, UserX, Music2, Radio, Podcast, Palette, Wand2, LogOut, Users, UserPlus, MoreVertical, LayoutGrid, Square, MessageSquare, User } from "lucide-react";
import { WorkspaceChat } from "./chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { GlobalSearch } from "@/components/layout/global-search";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWorkspace } from "@/context/workspace-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


type UserType = typeof placeholderUsers[0];
type LayoutMode = 'speaker' | 'grid';

type ParticipantCardProps = {
  user: UserType;
  onRemove?: (id: string) => void;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  isSpeaking: boolean;
  showAvatars: boolean;
  onClick?: () => void;
  isThumbnail?: boolean;
}

function ParticipantCard({ user, onRemove, isCameraOn, isScreenSharing, isSpeaking, showAvatars, onClick, isThumbnail = false }: ParticipantCardProps) {
  const [isMuted, setIsMuted] = useState(Math.random() > 0.5);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();


  useEffect(() => {
    if (isCameraOn && videoRef.current) {
        // In a real app, you'd get the user's actual media stream.
        // For this placeholder, we just show a black box.
    }
  }, [isCameraOn]);
  
  const handleAction = (action: string, userName: string) => {
    toast({
        title: `${action}`,
        description: `This action would be applied to ${userName}.`
    });
  };

  const handleFullScreen = () => {
    toast({
        title: "Fullscreen Mode",
        description: "This would normally make the video full screen."
    })
  }


  return (
    <div 
        className={cn(
            "relative group/participant aspect-video overflow-hidden rounded-lg bg-muted transition-all duration-300 w-full h-full",
            isSpeaking && "ring-2 ring-primary ring-offset-2 ring-offset-background",
            isThumbnail ? 'cursor-pointer' : ''
        )}
        onClick={onClick}
    >
      {isScreenSharing ? (
         <div className="w-full h-full flex flex-col items-center justify-center bg-blue-900/20 text-blue-200">
            <ScreenShare className={cn(isThumbnail ? "h-6 w-6" : "h-10 w-10")} />
            <p className={cn("mt-2 font-semibold", isThumbnail ? "text-xs" : "text-sm")}>Presenting</p>
        </div>
      ) : isCameraOn ? (
         <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
             {showAvatars ? (
                <Avatar className={cn(isThumbnail ? "h-12 w-12" : "h-20 w-20")}>
                    <AvatarFallback className={cn(isThumbnail ? "text-2xl" : "text-4xl")}>
                        <User className={cn(isThumbnail ? "h-6 w-6" : "h-10 w-10")} />
                    </AvatarFallback>
                </Avatar>
             ) : (
                <div className={cn("flex items-center justify-center rounded-full bg-muted-foreground/20", isThumbnail ? "h-12 w-12" : "h-20 w-20")}>
                    <span className={cn(isThumbnail ? "text-2xl" : "text-4xl", "font-semibold text-muted-foreground")}>{user.name.charAt(0)}</span>
                </div>
            )}
        </div>
      )}
       {isSpeaking && (
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/50 p-1 pr-2 text-xs text-white">
          <Volume2 className="h-4 w-4" />
        </div>
      )}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover/participant:opacity-100 transition-opacity">
        <p className="truncate text-sm font-medium text-white bg-black/30 px-2 py-1 rounded-md">{user.name}</p>
        {!isThumbnail &&
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
        }
      </div>
        <div className="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover/participant:opacity-100 transition-opacity">
             {!isThumbnail &&
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
                                onClick={handleFullScreen}
                                >
                                <Maximize className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Fullscreen</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            }
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/participant:opacity-100 transition-opacity">
            {onRemove && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('Mute', user.name)}>
                            <MicOff className="mr-2 h-4 w-4" />
                            <span>Mute {user.name}</span>
                        </DropdownMenuItem>
                         <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => onRemove(user.id)}>
                            <UserX className="mr-2 h-4 w-4" />
                            <span>Remove from call</span>
                        </DropdownMenuItem>
                         <DropdownMenuItem className="text-destructive" onClick={() => handleAction('Ban', user.name)}>
                            <Ban className="mr-2 h-4 w-4" />
                            <span>Ban from workspace</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    </div>
  );
}


export function WorkspaceTeam() {
    const { 
        time, 
        isActive,
        formatTime,
        toggleTimer,
        endSession,
        participants,
        setParticipants,
    } = useWorkspace();
    const allUsers = placeholderUsers;
    
    const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(participants[0]?.id || null);
    const [pinnedUserId, setPinnedUserId] = useState<string | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [hasScreenPermission, setHasScreenPermission] = useState<boolean | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [showAvatars, setShowAvatars] = useState(true);
    const [musicSource, setMusicSource] = useState<string | null>(null);
    const [streamMode, setStreamMode] = useState('self');
    const [layout, setLayout] = useState<LayoutMode>('speaker');
    const [isMuted, setIsMuted] = useState(true);

    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    
    const pinnedParticipant = participants.find(p => p.id === (pinnedUserId || activeSpeakerId)) || participants[0];
    const thumbnailParticipants = participants.filter(p => p.id !== pinnedParticipant?.id);

    // Simulate active speaker change
    useEffect(() => {
        if (participants.length > 1 && !pinnedUserId) {
            const interval = setInterval(() => {
                const nonPinnedParticipants = participants.filter(p => p.id !== pinnedUserId);
                if (nonPinnedParticipants.length > 0) {
                    const randomIndex = Math.floor(Math.random() * nonPinnedParticipants.length);
                    setActiveSpeakerId(nonPinnedParticipants[randomIndex].id);
                } else if (participants.length > 0) {
                    setActiveSpeakerId(participants[0].id);
                }
            }, 3000); // Change speaker every 3 seconds
            return () => clearInterval(interval);
        }
    }, [participants, pinnedUserId]);


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

    const handleInvite = (userToInvite: UserType) => {
        if (participants.some(p => p.id === userToInvite.id)) {
            toast({ variant: "default", title: "Already in Session", description: `${userToInvite.name} is already in the workspace.` });
            return;
        }

        if (participants.length < 15) {
            setParticipants(prev => [...prev, userToInvite]);
            toast({ title: "User Invited", description: `${userToInvite.name} has been added to the workspace.` });
        } else {
            toast({ variant: "destructive", title: "Workspace Full", description: "You cannot invite more than 15 participants." });
        }
    };

    const handleRemove = (userId: string) => {
        const removedUser = participants.find(p => p.id === userId);
        if (removedUser) {
            setParticipants(prev => prev.filter(p => p.id !== userId));
            if (pinnedUserId === userId) {
                setPinnedUserId(null); // Unpin if the removed user was pinned
            }
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

    const ControlButton = ({ tooltip, onClick, children, variant = "ghost", size="icon", className, 'data-active': dataActive }: { tooltip: string, onClick?: () => void, children: React.ReactNode, variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link", size?: "default" | "sm" | "lg" | "icon" | null, className?: string, 'data-active'?: boolean }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={variant}
                        size={size}
                        onClick={onClick}
                        className={cn(
                          "transition-all",
                          className
                        )}
                        data-active={dataActive}
                    >
                        {children}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    const getGridLayout = (count: number) => {
        if (count <= 2) return 'grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1';
        if (count <= 4) return 'grid-cols-2 grid-rows-2';
        if (count <= 6) return 'grid-cols-3 grid-rows-2';
        if (count <= 9) return 'grid-cols-3 grid-rows-3';
        return 'grid-cols-4 grid-rows-4';
    };

    return (
        <div className={cn("grid h-screen grid-cols-1", isChatOpen ? "lg:grid-cols-4" : "lg:grid-cols-12")}>
            {/* Main Content Area */}
            <div className={cn("flex flex-col h-full", isChatOpen ? "lg:col-span-3" : "lg:col-span-12")}>
                 <Card className="rounded-none border-0 h-full flex flex-col">
                    <CardHeader className="p-0 border-b">
                    </CardHeader>
                    <CardContent className="flex-1 p-2 flex flex-col bg-muted/30">
                        {layout === 'speaker' && pinnedParticipant && (
                            <div className="flex-1 flex flex-row gap-4">
                                {thumbnailParticipants.length > 0 && (
                                    <ScrollArea className="h-full">
                                        <div className="flex flex-col h-full space-y-4 pr-2">
                                            {thumbnailParticipants.map(user => (
                                                <div key={user.id} className="w-40 flex-shrink-0">
                                                    <ParticipantCard
                                                        user={user}
                                                        isCameraOn={false}
                                                        isScreenSharing={false}
                                                        isSpeaking={user.id === activeSpeakerId}
                                                        showAvatars={showAvatars}
                                                        onClick={() => setPinnedUserId(user.id)}
                                                        isThumbnail={true}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                                <div className="flex-1">
                                    <ParticipantCard
                                        user={pinnedParticipant}
                                        onRemove={handleRemove}
                                        isCameraOn={isCameraOn && pinnedParticipant.id === placeholderUsers[1].id}
                                        isScreenSharing={isScreenSharing && pinnedParticipant.id === placeholderUsers[1].id}
                                        isSpeaking={pinnedParticipant.id === activeSpeakerId}
                                        showAvatars={showAvatars}
                                    />
                                </div>
                            </div>
                        )}

                        {layout === 'grid' && (
                            <div className={cn("grid gap-4 flex-1", getGridLayout(participants.length))}>
                                {participants.map(user => (
                                    <ParticipantCard
                                        key={user.id}
                                        user={user}
                                        onRemove={handleRemove}
                                        isCameraOn={isCameraOn && user.id === placeholderUsers[1].id}
                                        isScreenSharing={isScreenSharing && user.id === placeholderUsers[1].id}
                                        isSpeaking={user.id === activeSpeakerId}
                                        showAvatars={showAvatars}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="px-2 py-1 border-t bg-black text-white">
                         <div className="flex justify-between items-center w-full">
                           <div className="flex items-center bg-muted p-1 rounded-full">
                                <ControlButton tooltip="Speaker View" onClick={() => setLayout('speaker')} variant={layout === 'speaker' ? 'secondary' : 'ghost'} size="sm" className="rounded-full" data-active={layout === 'speaker'}>
                                    <Square />
                                </ControlButton>
                                <ControlButton tooltip="Grid View" onClick={() => setLayout('grid')} variant={layout === 'grid' ? 'secondary' : 'ghost'} size="sm" className="rounded-full" data-active={layout === 'grid'}>
                                    <LayoutGrid />
                                </ControlButton>
                           </div>

                            <div className="flex items-center gap-2">
                                <ControlButton tooltip={isMuted ? 'Unmute' : 'Mute'} onClick={() => setIsMuted(prev => !prev)} variant="secondary" size="lg" className="rounded-full h-12 w-12 bg-muted hover:bg-muted-foreground/20" data-active={!isMuted}>
                                    {isMuted ? <MicOff /> : <Mic />}
                                </ControlButton>
                                <ControlButton tooltip={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'} onClick={handleToggleCamera} variant={isCameraOn ? "default" : "secondary"} size="lg" className="rounded-full h-12 w-12 bg-muted hover:bg-muted-foreground/20" data-active={isCameraOn}>
                                    {isCameraOn ? <Video /> : <VideoOff />}
                                </ControlButton>
                                <ControlButton tooltip={isScreenSharing ? 'Stop Sharing' : 'Share Screen'} onClick={handleToggleScreenShare} variant={isScreenSharing ? "default" : "secondary"} size="lg" className="rounded-full h-12 w-12 bg-muted hover:bg-muted-foreground/20" data-active={isScreenSharing}>
                                    {isScreenSharing ? <ScreenShare /> : <ScreenShareOff />}
                                </ControlButton>
                                 <ControlButton tooltip={isRecording ? 'Stop Recording' : 'Start Recording'} onClick={handleToggleRecording} variant={isRecording ? "destructive" : "secondary"} size="lg" className="rounded-full h-12 w-12 bg-muted hover:bg-destructive/80" data-active={isRecording}>
                                    <CircleDot />
                                </ControlButton>
                                <ControlButton tooltip="Leave Session" variant="destructive" size="lg" onClick={endSession} className="rounded-full h-12 w-12">
                                    <LogOut />
                                </ControlButton>
                            </div>

                            <div className="flex items-center bg-muted p-1 rounded-full">
                                <ControlButton tooltip="Team" variant="ghost" size="sm" className="rounded-full">
                                   <Dialog>
                                    <DialogTrigger asChild><span><Users /></span></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader><DialogTitle>Participants</DialogTitle></DialogHeader>
                                        <ScrollArea className="max-h-[60vh] pr-4">
                                            <div className="space-y-4">
                                                {participants.map(user => (
                                                    <div key={user.id} className="flex items-center gap-3">
                                                        <Avatar className={cn("h-9 w-9", user.id === activeSpeakerId && "ring-2 ring-primary ring-offset-1 ring-offset-background")}>
                                                            <AvatarFallback>
                                                                <User className="h-5 w-5" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1"><p className="font-semibold text-sm">{user.name}</p><p className="text-xs text-muted-foreground">{user.headline}</p></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                                </ControlButton>
                                <ControlButton tooltip="Invite" variant="ghost" size="sm" className="rounded-full">
                                     <Dialog>
                                     <DialogTrigger asChild><span><UserPlus /></span></DialogTrigger>
                                     <DialogContent>
                                        <DialogHeader><DialogTitle>Invite to Workspace</DialogTitle></DialogHeader>
                                        <ScrollArea className="max-h-[60vh] pr-4">
                                            <div className="space-y-4">
                                            {onlineUsers.map(user => (
                                                <div key={user.id} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarFallback>
                                                                <User className="h-5 w-5" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div><p className="font-semibold">{user.name}</p><div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /><p className="text-xs text-muted-foreground">Online</p></div></div>
                                                    </div>
                                                    <Button variant="outline" size="sm" onClick={() => handleInvite(user)} disabled={participants.length >= 15}><UserPlus className="h-4 w-4 mr-2" />Invite</Button>
                                                </div>
                                            ))}
                                            </div>
                                        </ScrollArea>
                                        <DialogFooter>
                                            <Button size="lg" className="w-full" onClick={handleCopyLink}><Copy className="mr-2 h-4 w-4"/>Copy Invite Link</Button>
                                        </DialogFooter>
                                     </DialogContent>
                                </Dialog>
                                </ControlButton>
                                <ControlButton tooltip="Chat" variant={isChatOpen ? 'secondary' : 'ghost'} size="sm" onClick={() => setIsChatOpen(prev => !prev)} className="rounded-full">
                                    <MessageSquare />
                                </ControlButton>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
                 {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Camera Access Denied</AlertTitle>
                        <AlertDescription>Please enable camera permissions in your browser settings to use this feature.</AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Right Sidebar */}
             <div className={cn("transition-all duration-300", !isChatOpen && "hidden")}>
                <Card className="h-full flex flex-col rounded-none border-l">
                   <CardHeader className="p-4 border-b flex items-center justify-between">
                        <CardTitle className="text-xl">Chat</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                   </CardHeader>
                   <div className="flex-1 flex flex-col min-h-0">
                     <WorkspaceChat />
                   </div>
                </Card>
            </div>
             <Toaster />
        </div>
    )
}

