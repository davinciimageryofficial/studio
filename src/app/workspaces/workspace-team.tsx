
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderUsers } from "@/lib/placeholder-data";
import { Timer as TimerIcon, Mic, MicOff, Copy, Plus, X, Video, VideoOff, CircleDot, PenSquare, Hand, Lightbulb, Play, Pause, AlertCircle, ScreenShare, ScreenShareOff, PanelLeft, PanelRight, Maximize, Volume2, Ban, UserX, Music2, Radio, Podcast, Palette, Wand2, LogOut, Users, UserPlus, MoreVertical } from "lucide-react";
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


type User = typeof placeholderUsers[0];

type ParticipantCardProps = {
  user: User;
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
            "relative group/participant aspect-video overflow-hidden rounded-lg bg-muted transition-all duration-300",
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
            <Avatar className={cn(isThumbnail ? "h-12 w-12" : "h-20 w-20")}>
                {showAvatars && user.avatar && <AvatarImage src={user.avatar} className="object-cover" />}
                <AvatarFallback className={cn(isThumbnail ? "text-2xl" : "text-4xl")}>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
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
    const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
    const [showAvatars, setShowAvatars] = useState(true);
    const [musicSource, setMusicSource] = useState<string | null>(null);
    const [streamMode, setStreamMode] = useState('self');
    const [activeTab, setActiveTab] = useState("invites");

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

    const handleInvite = (userToInvite: User) => {
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

    const ControlButton = ({ tooltip, onClick, children, variant = "default", className }: { tooltip: string, onClick?: () => void, children: React.ReactNode, variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link", className?: string }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={variant}
                        onClick={onClick}
                        className={cn("text-xs bg-black hover:bg-gray-800 h-8", className, isControlsCollapsed && "w-8 px-0")}
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3 flex flex-col gap-6">
                 <Card className="flex-1 flex flex-col">
                    <CardHeader className="p-4 border-b flex-row items-center justify-between">
                        <CardTitle>Team Workspace</CardTitle>
                        <div className="flex items-center gap-2 font-mono text-lg font-bold">
                            <TimerIcon className="h-5 w-5"/>
                            {formatTime(time)}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 flex flex-col">
                       {pinnedParticipant && (
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
                       )}
                        
                        {thumbnailParticipants.length > 0 && (
                            <ScrollArea className="w-full whitespace-nowrap pt-4">
                                <div className="flex w-max space-x-4">
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
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        )}
                    </CardContent>
                    <CardFooter className="p-2 border-t bg-card">
                         <div className="flex justify-between items-center w-full gap-2">
                            {/* Left Controls */}
                             <div className="flex items-center gap-2">
                                {/* Placeholder for left controls if needed */}
                            </div>

                            {/* Center Controls */}
                             <div className="flex items-center gap-2">
                                <ControlButton tooltip={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'} onClick={handleToggleCamera} variant={isCameraOn ? "secondary" : "default"}>
                                    {isCameraOn ? <VideoOff /> : <Video />}
                                </ControlButton>
                                <ControlButton tooltip={isScreenSharing ? 'Stop Sharing' : 'Share Screen'} onClick={handleToggleScreenShare} variant={isScreenSharing ? "secondary" : "default"}>
                                    {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
                                </ControlButton>
                                 <ControlButton tooltip={isRecording ? 'Stop Recording' : 'Start Recording'} onClick={handleToggleRecording} variant={isRecording ? "destructive" : "default"}>
                                    <CircleDot />
                                </ControlButton>
                                <Separator orientation="vertical" className="h-8" />
                                <ControlButton tooltip="Whiteboard">
                                    <PenSquare />
                                </ControlButton>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div> 
                                            <ControlButton tooltip="AI Assistant">
                                                <Lightbulb />
                                            </ControlButton>
                                        </div>
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
                                <ControlButton tooltip={showAvatars ? 'Hide Pictures' : 'Show Pictures'} onClick={handleToggleAvatars}>
                                    <UserX />
                                </ControlButton>
                            </div>
                            
                            {/* Right Controls */}
                             <div className="flex items-center gap-2">
                                 <ControlButton tooltip="Leave Session" variant="destructive" onClick={endSession}>
                                    <LogOut />
                                    {!isControlsCollapsed && <span className="ml-2">Leave</span>}
                                </ControlButton>
                                <Button size="icon" variant="outline" onClick={() => setIsControlsCollapsed(!isControlsCollapsed)} className="h-8 w-8">
                                    {isControlsCollapsed ? <PanelRight /> : <PanelLeft />}
                                </Button>
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
            <div className="lg:col-span-2 flex flex-col gap-6">
                <Card className="flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-center">
                                <CardTitle>Manage Team</CardTitle>
                            </div>
                            <TabsList className="grid w-full grid-cols-3 mt-2">
                                <TabsTrigger value="invites">Invite Users</TabsTrigger>
                                <TabsTrigger value="chat">Live Chat</TabsTrigger>
                                <TabsTrigger value="music">Music</TabsTrigger>
                            </TabsList>
                        </CardHeader>
                        <TabsContent value="invites" className="p-0 flex-1 flex flex-col">
                           <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto">
                                {onlineUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                {showAvatars && user.avatar && <AvatarImage src={user.avatar} />}
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
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Invite
                                        </Button>
                                    </div>
                                ))}
                           </CardContent>
                            <CardFooter className="p-4 border-t">
                                <Button size="lg" className="w-full" onClick={handleCopyLink}>
                                    <Copy className="mr-2 h-4 w-4"/>
                                    Copy Invite Link
                                </Button>
                            </CardFooter>
                        </TabsContent>
                         <TabsContent value="chat" className="p-0 flex-1">
                            <div className="h-[24rem]">
                                <WorkspaceChat />
                            </div>
                        </TabsContent>
                         <TabsContent value="music" className="p-0 flex-1">
                           <div className="h-[24rem]">
                            <CardContent className="pt-6">
                                {musicSource ? (
                                    <div className="space-y-4">
                                        <Card className="overflow-hidden">
                                            <div className="flex items-center gap-4 p-4">
                                                <Image src="https://picsum.photos/seed/album-art/100/100" width={64} height={64} alt="Album Art" className="rounded-md" />
                                                <div className="flex-1">
                                                    <p className="font-semibold">Song Title Placeholder</p>
                                                    <p className="text-sm text-muted-foreground">Artist Name</p>
                                                </div>
                                            </div>
                                        </Card>
                                        <div>
                                            <Label className="font-semibold">Stream Mode</Label>
                                            <RadioGroup value={streamMode} onValueChange={setStreamMode} className="mt-2">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="self" id="self" />
                                                    <Label htmlFor="self" className="flex items-center gap-2">
                                                        <Mic className="h-4 w-4" /> Stream for Self
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="crew" id="crew" />
                                                    <Label htmlFor="crew" className="flex items-center gap-2">
                                                        <Radio className="h-4 w-4" /> Stream for Crew
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <Button variant="outline" onClick={() => setMusicSource(null)}>Disconnect</Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 text-center">
                                         <p className="text-sm text-muted-foreground">Connect a music service to start listening.</p>
                                         <div className="flex flex-col gap-2">
                                            <Button variant="outline" onClick={() => setMusicSource('spotify')}>
                                                <Music2 className="mr-2 h-4 w-4" />
                                                Connect Spotify
                                            </Button>
                                            <Button variant="outline" onClick={() => setMusicSource('youtube')}>
                                                <Podcast className="mr-2 h-4 w-4" />
                                                Connect YouTube Music
                                            </Button>
                                         </div>
                                    </div>
                                )}
                            </CardContent>
                           </div>
                        </TabsContent>
                    </Tabs>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            <span>Participants ({participants.length})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-48">
                            <div className="space-y-4">
                                {participants.map(user => (
                                    <div key={user.id} className="flex items-center gap-3">
                                        <Avatar className={cn("h-9 w-9", user.id === activeSpeakerId && "ring-2 ring-primary ring-offset-1 ring-offset-background")}>
                                            {user.avatar && <AvatarImage src={user.avatar} />}
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.headline}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
             <Toaster />
        </div>
    )
}
