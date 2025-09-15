
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '@/context/workspace-context';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Mic, MicOff, Video, VideoOff, ScreenShare, ScreenShareOff, UserPlus, MessageSquare, Settings, LogOut, Circle, Pause, Play, Hand, List, LayoutGrid, GalleryVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { getUsers } from '@/lib/database';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


function ParticipantCard({ participant, isMuted, isCameraOff, isSpeaking, videoRef }: { participant: User, isMuted: boolean, isCameraOff: boolean, isSpeaking: boolean, videoRef?: React.RefObject<HTMLVideoElement> }) {
  return (
    <div className={cn(
      "relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center transition-all duration-300",
      isSpeaking ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""
    )}>
       <video ref={videoRef} className={cn("absolute inset-0 w-full h-full object-cover", isCameraOff && "hidden")} autoPlay playsInline muted={isMuted} />
      {isCameraOff && <VideoOff className="h-12 w-12 text-muted-foreground" />}
      <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
        {isMuted ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
        <span>{participant.name}</span>
      </div>
    </div>
  );
}

function ControlButton({ icon: Icon, label, isActive, onClick, variant = 'secondary', size = "sm", className = "" }: { icon: React.ElementType, label: string, isActive?: boolean, onClick?: () => void, variant?: "default" | "secondary" | "destructive" | "ghost", size?: "default" | "icon" | "sm" | "lg", className?: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={isActive ? 'default' : variant} size={size} onClick={onClick} className={className}>
                        <Icon className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>{label}</p></TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

function InviteDialog() {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [connections, setConnections] = useState<User[]>([]);

    useEffect(() => {
        async function fetchConnections() {
            const users = await getUsers();
            // In a real app, you'd filter for actual connections. For now, just exclude current user.
            setConnections(users.filter(u => u.id !== '2'));
        }
        fetchConnections();
    }, []);

    const handleSelectUser = (userId: string) => {
        setSelectedUsers(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    }
    
    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Invite to Workspace</DialogTitle>
                <DialogDescription>Select people from your network to invite.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <ScrollArea className="h-60 rounded-md border">
                    <div className="p-4 space-y-3">
                        {connections.map(user => (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                      <AvatarImage src={user.avatar} />
                                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.headline}</p>
                                    </div>
                                </div>
                                <Checkbox 
                                    checked={selectedUsers.includes(user.id)}
                                    onCheckedChange={() => handleSelectUser(user.id)}
                                />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
             <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <DialogClose asChild><Button type="button">Send Invites</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
    );
}

export function WorkspaceTeam() {
  const { participants, endSession } = useWorkspace();
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(participants[0]?.id || null);
  const [layout, setLayout] = useState<'sidebar' | 'grid' | 'gallery'>('sidebar');
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  
  const videoRefs = useRef<Record<string, React.RefObject<HTMLVideoElement>>>({});
  participants.forEach(p => {
    if (!videoRefs.current[p.id]) {
        videoRefs.current[p.id] = React.createRef<HTMLVideoElement>();
    }
  });

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        setHasCameraPermission(true);

        participants.forEach(p => {
            if(videoRefs.current[p.id]?.current) {
                videoRefs.current[p.id].current!.srcObject = stream;
            }
        })
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [participants, toast]);

  const getGridLayout = (count: number) => {
    if (count <= 1) return "grid-cols-1";
    if (count <= 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-1 sm:grid-cols-2";
    if (count <= 6) return "grid-cols-2 md:grid-cols-3";
    if (count <= 9) return "grid-cols-2 sm:grid-cols-3";
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";
  };
  
  const pinnedParticipant = participants.find(p => p.id === pinnedParticipantId);
  const otherParticipants = participants.filter(p => p.id !== pinnedParticipantId);

  const toggleLayout = () => {
    setLayout(current => {
        if (current === 'sidebar') return 'grid';
        if (current === 'grid') return 'gallery';
        return 'sidebar';
    });
  }

  const getLayoutIcon = () => {
    if (layout === 'sidebar') return List;
    if (layout === 'grid') return LayoutGrid;
    return GalleryVertical;
  }
  
  const getLayoutLabel = () => {
    if (layout === 'sidebar') return 'Sidebar View';
    if (layout === 'grid') return 'Grid View';
    return 'Gallery View';
  }

  const renderLayout = () => {
    switch (layout) {
        case 'grid':
            return (
                <ScrollArea className="flex-1">
                    <div className={cn("grid gap-2 p-2", getGridLayout(participants.length))}>
                    {participants.map((p, index) => (
                        <div key={p.id} onClick={() => setPinnedParticipantId(p.id)} className="cursor-pointer">
                            <ParticipantCard participant={p} isMuted={index > 0} isCameraOff={isCameraOff} isSpeaking={index === 0} videoRef={videoRefs.current[p.id]} />
                        </div>
                    ))}
                    </div>
                </ScrollArea>
            )
        case 'gallery':
             return (
                 <ScrollArea className="flex-1">
                    <div className="flex gap-2 p-2">
                         {participants.map((p, index) => (
                            <div key={p.id} onClick={() => setPinnedParticipantId(p.id)} className="cursor-pointer w-48 flex-shrink-0">
                                <ParticipantCard participant={p} isMuted={index > 0} isCameraOff={isCameraOff} isSpeaking={index === 0} videoRef={videoRefs.current[p.id]} />
                            </div>
                        ))}
                    </div>
                 </ScrollArea>
            )
        default: // sidebar
             return (
                 <div className="flex-1 flex flex-col md:flex-row gap-2 p-2">
                    <div className="flex-1 h-full">
                        {pinnedParticipant && <ParticipantCard participant={pinnedParticipant} isMuted={false} isCameraOff={isCameraOff} isSpeaking={true} videoRef={videoRefs.current[pinnedParticipant.id]}/>}
                    </div>
                    <ScrollArea className="w-full md:w-48 h-24 md:h-full">
                        <div className="flex md:flex-col gap-2">
                            {otherParticipants.map(p => (
                                <div key={p.id} onClick={() => setPinnedParticipantId(p.id)} className="cursor-pointer">
                                    <ParticipantCard participant={p} isMuted={true} isCameraOff={isCameraOff} isSpeaking={false} videoRef={videoRefs.current[p.id]} />
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )
    }
  }


  return (
    <div className="flex h-[calc(100vh-4.5rem)] w-full bg-background">
      <div className="flex flex-1 flex-col">
        {!hasCameraPermission && (
            <div className="p-4">
                <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to use this feature. The component is attempting to render, but cannot access your camera.
                    </AlertDescription>
                </Alert>
            </div>
        )}
        {renderLayout()}
        <CardFooter className="px-2 py-1 border-t bg-black text-white rounded-b-lg">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1">
                <ControlButton icon={Hand} label="Raise Hand" variant="ghost" className="text-white hover:bg-gray-700 hover:text-white" size="sm"/>
                <ControlButton icon={getLayoutIcon()} label={getLayoutLabel()} variant="ghost" className="text-white hover:bg-gray-700 hover:text-white" size="sm" onClick={toggleLayout} />
            </div>
            <div className="flex items-center gap-2">
              <ControlButton icon={isMuted ? MicOff : Mic} label={isMuted ? "Unmute" : "Mute"} onClick={() => setIsMuted(!isMuted)} variant="ghost" size="icon" className={cn("h-10 w-10 rounded-full", isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600")} />
              <ControlButton icon={isCameraOff ? VideoOff : Video} label={isCameraOff ? "Start Camera" : "Stop Camera"} onClick={() => setIsCameraOff(!isCameraOff)} variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600" />
              <ControlButton icon={isSharingScreen ? ScreenShareOff : ScreenShare} label={isSharingScreen ? "Stop Sharing" : "Share Screen"} onClick={() => setIsSharingScreen(!isSharingScreen)} variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600" />
              <ControlButton icon={isRecording ? Pause : Circle} label={isRecording ? "Pause Recording" : "Record"} onClick={() => setIsRecording(!isRecording)} variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600" />
              <ControlButton icon={LogOut} label="Leave Session" onClick={endSession} variant="destructive" size="icon" className="h-10 w-10 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
                <Dialog>
                    <DialogTrigger asChild><ControlButton icon={UserPlus} label="Invite" variant="ghost" className="text-white hover:bg-gray-700 hover:text-white" size="sm" /></DialogTrigger>
                    <InviteDialog />
                </Dialog>
                <ControlButton icon={Settings} label="Settings" variant="ghost" className="text-white hover:bg-gray-700 hover:text-white" size="sm" />
            </div>
          </div>
        </CardFooter>
      </div>
    </div>
  );
}
