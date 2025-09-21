
"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Smile, Phone, Video, Settings, Bold, Italic, Code, Paperclip, Link2, Eye, EyeOff, Kanban, UserPlus, User, PlusCircle, Users, Building, Briefcase, PhoneOutgoing, PhoneOff, Mic, MicOff, VideoOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User as UserType } from "@/lib/types";
import { getUsers } from "@/lib/database";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";


type Message = {
    from: string,
    text: string,
    time: string,
    fromName?: string
};

type Conversation = { 
    id: string;
    name: string;
    avatar?: string;
    lastMessage: Message,
    messages?: Message[],
    type?: 'dm' | 'group' | 'agency' 
};

const GoogleDriveIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.7925 14.424L3.06 22.5L8.25 22.5L12.795 14.424H7.7925Z" fill="#34A853"/>
        <path d="M12.795 14.424L17.5275 6.34799L21.9375 14.424H12.795Z" fill="#FFC107"/>
        <path d="M21.1875 1.5H2.8125L8.25 11.4585L12.795 14.424L17.5275 6.348L21.1875 1.5Z" fill="#4285F4"/>
    </svg>
);

interface MessagesClientProps {
    initialConversations: Conversation[];
    initialAllUsers: UserType[];
    currentUser: UserType | null;
}

export function MessagesClient({ initialConversations, initialAllUsers, currentUser }: MessagesClientProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [allUsers, setAllUsers] = useState<UserType[]>(initialAllUsers);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConversations[0]?.id || null);
  const [fontSize, setFontSize] = useState("base");
  const [showAvatars, setShowAvatars] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const [newMessage, setNewMessage] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const projectParam = searchParams.get('project');
    const applicationParam = searchParams.get('application');

    const handleNewConversation = (
        partnerId: string,
        partnerName: string,
        partnerHeadline: string,
        initialMessageText: string
    ) => {
        let partnerConversation = conversations.find(c => c.id === partnerId);
        const newMessageObj: Message = {
            from: 'me',
            text: initialMessageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        if (partnerConversation) {
            partnerConversation.messages?.push(newMessageObj);
            partnerConversation.lastMessage = newMessageObj;
            setConversations([...conversations]);
            setActiveConversationId(partnerConversation.id);
        } else {
            const partnerDetails = allUsers.find(u => u.id === partnerId);
            const newConversation: Conversation = {
                id: partnerId,
                name: partnerName,
                avatar: partnerDetails?.avatar,
                lastMessage: newMessageObj,
                messages: [newMessageObj],
            };
            setConversations(prev => [newConversation, ...prev]);
            setActiveConversationId(partnerId);
        }
    };


    if (projectParam) {
        try {
            const project = JSON.parse(projectParam);
            const clientName = project.clientName || 'New Client';
            const projectTitle = project.projectTitle || 'New Project';
            const recruiterId = `recruiter-${clientName.replace(/\s/g, '')}`;

            handleNewConversation(
                recruiterId,
                clientName,
                "Project Client",
                `Hi, I'm interested in the "${projectTitle}" project. Let's discuss the details.`
            );
        } catch (error) {
            console.error("Failed to parse project data from URL", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not start conversation from project link."
            });
        }
    } else if (applicationParam) {
        try {
            const app = JSON.parse(applicationParam);
            const recruiter = allUsers.find(u => u.id === app.recruiterId);

            if (recruiter) {
                const applicationMessage = `
                    <div class="p-4 rounded-lg border bg-card shadow-sm">
                        <div class="flex items-center gap-3 pb-3 border-b mb-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <${'Briefcase'} />
                            </div>
                            <div>
                                <h4 class="font-semibold">New Application: ${app.jobTitle}</h4>
                                <p class="text-xs text-muted-foreground">Submitted by ${app.applicantName}</p>
                            </div>
                        </div>
                        <p class="text-sm font-semibold">Cover Letter:</p>
                        <p class="text-sm text-muted-foreground italic">"${app.coverLetter || 'No cover letter provided.'}"</p>
                        <a href="/profile/${app.applicantId}" class="mt-4 inline-block w-full text-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80">View Applicant's Profile</a>
                    </div>
                `;
                handleNewConversation(recruiter.id, recruiter.name, recruiter.headline, applicationMessage);
            }
        } catch (error) {
            console.error("Failed to parse application data from URL", error);
        }
    }

  }, [searchParams, toast, allUsers, conversations]);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const messageContent = editorRef.current?.innerHTML || '';
    if (!messageContent.trim() || !activeConversationId || !currentUser) return;
    
    const { error } = await supabase.from('messages').insert({
        content: messageContent,
        sender_id: currentUser.id,
        conversation_id: activeConversationId
    });

    if (error) {
        toast({
            title: "Error Sending Message",
            description: "Could not send your message. Please try again.",
            variant: "destructive"
        });
        return;
    }

    const newMessageObj: Message = {
      from: 'me',
      text: messageContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations(prev => 
        prev.map(convo => {
            if (convo.id === activeConversationId) {
                return {
                    ...convo,
                    messages: [...(convo.messages || []), newMessageObj],
                    lastMessage: newMessageObj,
                }
            }
            return convo;
        })
    );
    
    if (editorRef.current) {
        editorRef.current.innerHTML = "";
    }
    setNewMessage("");
  };


  
  const handleInput = () => {
    // This function can be used for features like typing indicators in the future
  }


  const handleTextFormat = (format: 'bold' | 'italic' | 'insertHTML', value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (format === 'insertHTML' && value) {
         document.execCommand(format, false, value);
      } else {
         document.execCommand(format, false);
      }
    }
  };

  const handleCodeSnippet = () => {
    const snippet = `<pre><code class="language-javascript">console.log("Hello, World!");</code></pre>`;
    handleTextFormat('insertHTML', snippet);
  }

  const filteredConversations = conversations.filter(convo => {
    if (activeTab === 'all') return true;
    if (activeTab === 'groups') return convo.type === 'group';
    if (activeTab === 'agencies') return convo.type === 'agency';
    return true;
  });


  return (
    <div className="h-[calc(100vh-4.5rem)]">
      <div className="grid h-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {/* Conversation List */}
        <div className="hidden flex-col border-r md:flex h-full">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Messages</h2>
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <PlusCircle className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <NewCommunityDialog />
                </Dialog>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-10" />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-2">
            <TabsList className="grid w-full grid-cols-3 bg-black text-muted-foreground">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="agencies">Agencies</TabsTrigger>
            </TabsList>
          </Tabs>

          <ScrollArea className="flex-1">
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((convo) => convo.id && (
                <button
                  key={convo.id}
                  onClick={() => setActiveConversationId(convo.id)}
                  className={cn(
                    "w-full p-4 text-left transition-colors hover:bg-accent",
                    activeConversationId === convo.id ? "bg-accent" : ""
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                        <AvatarImage src={convo.avatar} />
                        <AvatarFallback>
                            <User className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between">
                        <span className="font-semibold truncate">{convo.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{convo.lastMessage.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1" dangerouslySetInnerHTML={{ __html: convo.lastMessage.text }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        {activeConversation ? (
        <div className="flex flex-col md:col-span-2 lg:col-span-3">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b p-4">
            <Avatar>
                <AvatarImage src={activeConversation.avatar} />
                <AvatarFallback>
                    <User className="h-5 w-5" />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{activeConversation.name}</h3>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Phone /></Button>
                    </DialogTrigger>
                    <CallDialog user={activeConversation} isVideo={false} />
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Video /></Button>
                    </DialogTrigger>
                    <CallDialog user={activeConversation} isVideo={true} />
                </Dialog>
                <Button variant="ghost" size="icon"><UserPlus /></Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><Settings /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Chat View Settings</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Font Size</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={fontSize} onValueChange={setFontSize}>
                                    <DropdownMenuRadioItem value="sm">Small</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="base">Default</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="lg">Large</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <div className="flex items-center justify-between w-full">
                                <span>Hide Profile Pictures</span>
                                <Checkbox checked={!showAvatars} onCheckedChange={() => setShowAvatars(!showAvatars)} />
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
          
          {/* Messages */}
          <ScrollArea className="flex-1 bg-muted/20 p-4 sm:p-6" ref={scrollAreaRef}>
            <div className={`space-y-6 text-${fontSize}`}>
              {activeConversation.messages?.map((message, index) => (
                <div key={index} className={cn("flex items-end gap-2", message.from === 'me' ? 'justify-end' : 'justify-start')}>
                  {message.from !== 'me' && (
                    <Avatar className={cn("h-8 w-8", !showAvatars && "invisible")}>
                        <AvatarImage src={activeConversation.avatar} />
                        <AvatarFallback>
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("max-w-xs rounded-lg px-4 py-2 sm:max-w-md", message.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-card shadow')}>
                    <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: message.text }} />
                    <p className={cn("text-xs mt-1 text-right", message.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="border-t p-4 bg-card">
            <div className="relative rounded-lg border">
                <div
                    ref={editorRef}
                    contentEditable
                    className="min-h-12 w-full resize-none rounded-md bg-background p-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onInput={handleInput}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
              <div className="absolute right-2 top-2">
                <Button type="submit" size="icon" variant="ghost">
                  <Send />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
                <Button type="button" variant="ghost" size="icon" onClick={() => handleTextFormat('bold')}><Bold className="h-5 w-5" /></Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => handleTextFormat('italic')}><Italic className="h-5 w-5" /></Button>
                <Button type="button" variant="ghost" size="icon" onClick={handleCodeSnippet}><Code className="h-5 w-5" /></Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => toast({ title: "Coming Soon!", description: "File attachment functionality would be here."})}><Paperclip className="h-5 w-5" /></Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => toast({ title: "Coming Soon!", description: "An emoji picker would appear here."})}><Smile className="h-5 w-5" /></Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => toast({ title: "Coming Soon!", description: "Google Drive integration is in development."})}>
                    <GoogleDriveIcon />
                </Button>
            </div>
          </form>
        </div>
        ) : (
             <div className="hidden md:flex flex-col items-center justify-center md:col-span-2 lg:col-span-3 text-center p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Kanban className="size-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Select a conversation</h3>
                <p className="text-muted-foreground">Choose from your existing conversations to start chatting.</p>
            </div>
        )}
      </div>
    </div>
  );
}

function NewCommunityDialog() {
    const { toast } = useToast();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [connections, setConnections] = useState<UserType[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            const users = await getUsers();
            // Exclude current user placeholder
            setConnections(users.filter(u => u.id !== '2'));
        }
        fetchUsers();
    }, []);

    const handleSelectUser = (userId: string) => {
        setSelectedUsers(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    }

    const handleCreateCommunity = () => {
        // In a real app, this would trigger a backend call to create the entity
        toast({
            title: `Community Created!`,
            description: `Your new community is ready to go.`,
        });
    }

    return (
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Create a New Space</DialogTitle>
                <DialogDescription>
                    Start a new Group for casual chats or an Agency for professional collaboration.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <Tabs defaultValue="group" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-black text-muted-foreground">
                        <TabsTrigger value="group"><Users className="mr-2 h-4 w-4" />Group</TabsTrigger>
                        <TabsTrigger value="agency"><Building className="mr-2 h-4 w-4" />Agency</TabsTrigger>
                    </TabsList>
                    <TabsContent value="group" className="mt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="group-name">Group Name</Label>
                            <Input id="group-name" placeholder="e.g., Q3 Project Team" />
                        </div>
                    </TabsContent>
                    <TabsContent value="agency" className="mt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="agency-name">Agency Name</Label>
                            <Input id="agency-name" placeholder="e.g., Innovate Creatives" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="agency-description">Agency Description</Label>
                            <Textarea id="agency-description" placeholder="A brief summary of your agency's focus." />
                        </div>
                    </TabsContent>
                </Tabs>
                
                <div className="space-y-2">
                    <Label>Invite Members</Label>
                    <ScrollArea className="h-40 rounded-md border">
                        <div className="p-4 space-y-3">
                            {connections.map(user => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>
                                                <User className="h-5 w-5" />
                                            </AvatarFallback>
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
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" onClick={handleCreateCommunity}>Create</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

function CallDialog({ user, isVideo }: { user: Conversation, isVideo: boolean }) {
  const [callStatus, setCallStatus] = useState<"calling" | "active" | "ended">("calling");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(isVideo);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let callTimer: NodeJS.Timeout;
    if (callStatus === "calling") {
      callTimer = setTimeout(() => setCallStatus("active"), 3000); // Simulate call connect
    } else if (callStatus === "active") {
      callTimer = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(callTimer);
  }, [callStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <DialogContent>
      <DialogHeader className="text-center items-center">
        {isVideo && (
             <div className="relative w-full aspect-video bg-muted rounded-lg mb-4">
                {isCameraOn ? (
                    <div className="w-full h-full bg-black flex items-center justify-center text-white">
                        {/* In a real app, this would be a <video> element */}
                        <p>Your video feed</p>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                         <Avatar className="h-24 w-24">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
                        </Avatar>
                    </div>
                )}
             </div>
        )}
        {!isVideo && (
            <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
            </Avatar>
        )}
        <DialogTitle className="text-2xl">{user.name}</DialogTitle>
        <DialogDescription>
          {callStatus === "calling" && "Calling..."}
          {callStatus === "active" && formatTime(timer)}
          {callStatus === "ended" && "Call Ended"}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className="flex w-full justify-center gap-4">
          <Button variant={isMuted ? "default" : "secondary"} size="icon" className="h-14 w-14 rounded-full" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
           {isVideo && (
              <Button variant={isCameraOn ? "default" : "secondary"} size="icon" className="h-14 w-14 rounded-full" onClick={() => setIsCameraOn(!isCameraOn)}>
                {isCameraOn ? <Video /> : <VideoOff />}
              </Button>
            )}
          <DialogClose asChild>
            <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full" onClick={() => setCallStatus('ended')}>
              <PhoneOff />
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
