
"use client";

import { useState, useEffect, useRef } from "react";
import { placeholderUsers, placeholderMessages } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Smile, Phone, Video, Settings, Bold, Italic, Code, Paperclip, Link2, Eye, EyeOff, Kanban, UserPlus, User, PlusCircle } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type Message = (typeof placeholderMessages)[0]['messages'][0] & { fromName?: string };
type Conversation = (typeof placeholderUsers[0]) & { lastMessage: Message, messages?: Message[], type?: 'dm' | 'group' | 'agency' };

export function MessagesClient() {
  const [conversations, setConversations] = useState<Conversation[]>(() => 
    placeholderMessages.map((msg, index) => {
        const user = placeholderUsers.find(u => u.id === msg.userId);
        return { 
            ...user!, 
            lastMessage: msg.messages[msg.messages.length - 1],
            messages: msg.messages,
            type: index % 3 === 0 ? 'group' : (index % 3 === 1 ? 'agency' : 'dm'),
        };
  }));
  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id);
  const [fontSize, setFontSize] = useState("base");
  const [showAvatars, setShowAvatars] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const [newMessage, setNewMessage] = useState("");
  const [linkPreview, setLinkPreview] = useState<{url: string, title: string, description: string, image: string} | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();


  useEffect(() => {
    const projectParam = searchParams.get('project');
    if (projectParam) {
        try {
            const project = JSON.parse(projectParam);
            const clientName = project.clientName || 'New Client';
            const projectTitle = project.projectTitle || 'New Project';

            // Check if a conversation with this client already exists
            let clientConversation = conversations.find(c => c.name === clientName);

            const initialMessageText = `Hi, I'm interested in the "${projectTitle}" project. Let's discuss the details.`;
            const newMessageObj: Message = {
                from: 'me',
                text: initialMessageText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            
            if (clientConversation) {
                // Add message to existing conversation
                clientConversation.messages?.push(newMessageObj);
                clientConversation.lastMessage = newMessageObj;
                setConversations([...conversations]);
                setActiveConversationId(clientConversation.id);
            } else {
                // Create a new conversation
                const newClientId = `client-${Date.now()}`;
                const newConversation: Conversation = {
                    id: newClientId,
                    name: clientName,
                    handle: clientName.toLowerCase().replace(' ', ''),
                    avatar: `https://picsum.photos/seed/${newClientId}/200/200`,
                    headline: "Project Client",
                    bio: "",
                    coverImage: "",
                    skills: [],
                    portfolio: [],
                    category: 'development', // Placeholder
                    lastMessage: newMessageObj,
                    messages: [newMessageObj],
                };
                setConversations(prev => [newConversation, ...prev]);
                setActiveConversationId(newClientId);
            }

        } catch (error) {
            console.error("Failed to parse project data from URL", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not start conversation from project link."
            });
        }
    }
  }, [searchParams, toast]);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const messageContent = editorRef.current?.innerHTML || '';
    if (!messageContent.trim() || !activeConversationId) return;

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
    setLinkPreview(null);
  };


  const extractUrl = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  }
  
  const handleInput = () => {
    const textContent = editorRef.current?.textContent || '';
    const url = extractUrl(textContent);
    if (url) {
        // In a real app, you would fetch metadata from this URL.
        // For now, we'll use placeholder data for the preview.
        setLinkPreview({
            url,
            title: "Link Preview Title",
            description: "This is a placeholder description for the link you shared. In a real application, we would fetch this from the website.",
            image: "https://picsum.photos/seed/link/400/200"
        });
    } else {
        setLinkPreview(null);
    }
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
        <div className="hidden flex-col border-r md:flex">
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="agencies">Agencies</TabsTrigger>
            </TabsList>
          </Tabs>

          <ScrollArea className="flex-1">
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
                  {showAvatars && (
                    <Avatar>
                        <AvatarFallback>
                            <User className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                  )}
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
          </ScrollArea>
        </div>

        {/* Chat Window */}
        {activeConversation ? (
        <div className="flex flex-col md:col-span-2 lg:col-span-3">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b p-4">
            {showAvatars && (
                <Avatar>
                    <AvatarFallback>
                        <User className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{activeConversation.name}</h3>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Phone /></Button>
                <Button variant="ghost" size="icon"><Video /></Button>
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
                  {message.from !== 'me' && showAvatars && (
                    <Avatar className="h-8 w-8">
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
              {linkPreview && (
                  <Card className="mb-2 overflow-hidden">
                      <Image src={linkPreview.image} width={400} height={200} alt="Link preview" className="w-full object-cover max-h-40" />
                      <div className="p-3">
                          <h4 className="font-semibold truncate">{linkPreview.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{linkPreview.description}</p>
                          <a href={linkPreview.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{linkPreview.url}</a>
                      </div>
                  </Card>
              )}
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
    const connections = placeholderUsers.filter(u => u.id !== '2'); // Exclude current user

    const handleSelectUser = (userId: string) => {
        setSelectedUsers(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    }

    const handleCreateCommunity = () => {
        // In a real app, this would trigger a backend call to create the community
        toast({
            title: "Community Created!",
            description: "Your new group is ready to go.",
        });
    }

    return (
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Create a new community</DialogTitle>
                <DialogDescription>
                    Start a new group chat with your connections.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input id="group-name" placeholder="e.g., Q3 Project Team" />
                </div>
                <div className="space-y-2">
                    <Label>Invite Members</Label>
                    <ScrollArea className="h-48 rounded-md border">
                        <div className="p-4 space-y-3">
                            {connections.map(user => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
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
                    <Button type="button" onClick={handleCreateCommunity}>Create Community</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}
