
"use client";

import { useState, useEffect, useRef } from "react";
import { placeholderUsers, placeholderMessages } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Smile, Phone, Video, Settings, Bold, Italic, Code, Paperclip, Link2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Message = (typeof placeholderMessages)[0]['messages'][0];

export function MessagesClient() {
  const [conversations, setConversations] = useState(placeholderMessages.map(msg => {
    const user = placeholderUsers.find(u => u.id === msg.userId);
    return { ...user, lastMessage: msg.messages[msg.messages.length - 1] };
  }));
  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id);
  const [fontSize, setFontSize] = useState("base");
  const [showAvatars, setShowAvatars] = useState(true);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const [activeMessages, setActiveMessages] = useState<Message[]>(placeholderMessages.find(m => m.userId === activeConversation?.id)?.messages || []);

  const [newMessage, setNewMessage] = useState("");
  const [linkPreview, setLinkPreview] = useState<{url: string, title: string, description: string, image: string} | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();


  useEffect(() => {
    // When the active conversation changes, update the messages
    const messages = placeholderMessages.find(m => m.userId === activeConversationId)?.messages || [];
    setActiveMessages(messages);
  }, [activeConversationId]);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [activeMessages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newMessage.trim() === "") return;

    const currentUser = placeholderUsers[1]; // Assuming 'me' is Bob Williams
    const message: Message = {
      from: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActiveMessages(prev => [...prev, message]);
    setNewMessage("");
    setLinkPreview(null);
  };


  const extractUrl = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  }

  useEffect(() => {
    const url = extractUrl(newMessage);
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
  }, [newMessage]);

  const handleTextFormat = (format: 'bold' | 'italic' | 'code') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newMessage.substring(start, end);
    
    let prefix = "";
    let suffix = "";

    switch(format) {
        case 'bold':
            prefix = "**";
            suffix = "**";
            break;
        case 'italic':
            prefix = "*";
            suffix = "*";
            break;
        case 'code':
            prefix = "`";
            suffix = "`";
            break;
    }
    
    const newText = 
      newMessage.substring(0, start) + 
      prefix + selectedText + suffix + 
      newMessage.substring(end);

    setNewMessage(newText);

    // After updating the state, focus the textarea and set the cursor position.
    // Use a timeout to ensure the state update has been rendered.
    setTimeout(() => {
      textarea.focus();
      const newCursorPosition = start + prefix.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition + selectedText.length);
    }, 0);
  };


  return (
    <div className="h-full">
      <div className="grid h-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {/* Conversation List */}
        <div className="hidden flex-col border-r md:flex">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Messages</h2>
                <div className="flex items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setShowAvatars(!showAvatars)}>
                                    {showAvatars ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{showAvatars ? 'Hide profile pictures' : 'Show profile pictures'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-10" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {conversations.map((convo) => convo.id && (
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
                      <AvatarImage src={convo.avatar} />
                      <AvatarFallback>{convo.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between">
                      <span className="font-semibold truncate">{convo.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{convo.lastMessage.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{convo.lastMessage.text}</p>
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
                  <AvatarImage src={activeConversation.avatar} />
                  <AvatarFallback>{activeConversation.name?.charAt(0)}</AvatarFallback>
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
              {activeMessages.map((message, index) => (
                <div key={index} className={cn("flex items-end gap-2", message.from === 'me' ? 'justify-end' : 'justify-start')}>
                  {message.from !== 'me' && showAvatars && activeConversation.avatar && <Avatar className="h-8 w-8"><AvatarImage src={activeConversation.avatar} /></Avatar>}
                  <div className={cn("max-w-xs rounded-lg px-4 py-2 sm:max-w-md", message.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-card shadow')}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className={cn("text-xs mt-1", message.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{message.time}</p>
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
              <Textarea 
                ref={textareaRef}
                placeholder="Type a message..." 
                className="min-h-12 resize-none border-0 ring-0 focus-visible:ring-0 pr-12"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
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
                <Button type="button" variant="ghost" size="icon" onClick={() => handleTextFormat('code')}><Code className="h-5 w-5" /></Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => toast({ title: "Coming Soon!", description: "File attachment functionality would be here."})}><Paperclip className="h-5 w-5" /></Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => toast({ title: "Coming Soon!", description: "An emoji picker would appear here."})}><Smile className="h-5 w-5" /></Button>
            </div>
          </form>
        </div>
        ) : (
             <div className="hidden md:flex flex-col items-center justify-center md:col-span-2 lg:col-span-3 text-center p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <svg className="size-10 text-muted-foreground" fill="currentColor" viewBox="0 0 256 256"><path d="M152,24a80,80,0,1,0,59.4,136H152V88a8,8,0,0,0,-16,0v72H68.6a80,80,0,1,0,83.4-136ZM128,200a64,64,0,1,1,64-64A64.07,64.07,0,0,1,128,200Z"></path></svg>
                </div>
                <h3 className="text-xl font-semibold">Select a conversation</h3>
                <p className="text-muted-foreground">Choose from your existing conversations to start chatting.</p>
            </div>
        )}
      </div>
    </div>
  );
}
