import { placeholderUsers, placeholderMessages } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const conversations = placeholderMessages.map(msg => {
    const user = placeholderUsers.find(u => u.id === msg.userId);
    return { ...user, lastMessage: msg.messages[msg.messages.length - 1] };
  });

  const activeConversation = conversations[0];
  const activeMessages = placeholderMessages.find(m => m.userId === activeConversation.id)?.messages || [];

  return (
    <div className="h-full">
      <div className="grid h-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {/* Conversation List */}
        <div className="hidden flex-col border-r md:flex">
          <div className="border-b p-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-10" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {conversations.map((convo, index) => convo.id && (
              <button
                key={convo.id}
                className={cn(
                  "w-full p-4 text-left transition-colors hover:bg-accent",
                  index === 0 ? "bg-accent" : ""
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={convo.avatar} />
                    <AvatarFallback>{convo.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">{convo.name}</span>
                      <span className="text-xs text-muted-foreground">{convo.lastMessage.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{convo.lastMessage.text}</p>
                  </div>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="flex flex-col md:col-span-2 lg:col-span-3">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b p-4">
            <Avatar>
              <AvatarImage src={activeConversation.avatar} />
              <AvatarFallback>{activeConversation.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{activeConversation.name}</h3>
              <p className="text-sm text-muted-foreground">{activeConversation.headline}</p>
            </div>
          </div>
          
          {/* Messages */}
          <ScrollArea className="flex-1 p-4 sm:p-6">
            <div className="space-y-6">
              {activeMessages.map((message, index) => (
                <div key={index} className={cn("flex items-end gap-2", message.from === 'me' ? 'justify-end' : 'justify-start')}>
                  {message.from !== 'me' && <Avatar className="h-8 w-8"><AvatarImage src={activeConversation.avatar} /></Avatar>}
                  <div className={cn("max-w-xs rounded-lg px-4 py-2 sm:max-w-md", message.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                    <p>{message.text}</p>
                    <p className={cn("text-xs mt-1", message.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="border-t p-4">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-20" />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Smile className="text-muted-foreground" />
                </Button>
                <Button size="icon">
                  <Send />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
