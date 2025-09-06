
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { placeholderUsers } from "@/lib/placeholder-data";

type Message = {
  user: typeof placeholderUsers[0];
  text: string;
  time: string;
};

export function WorkspaceChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      user: placeholderUsers[0],
      text: "Hey everyone, ready to get started on the Q3 planning doc?",
      time: "10:01 AM",
    },
    {
      user: placeholderUsers[2],
      text: "Yep, I have the latest version pulled up. Let's do it!",
      time: "10:02 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const currentUser = placeholderUsers[1]; // Assuming 'me' is Christian Peta
    const message: Message = {
      user: currentUser,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="flex h-full flex-col">
        <div className="flex-1">
          <ScrollArea className="h-full px-6 py-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                          <p className="font-semibold text-sm">{message.user.name}</p>
                          <p className="text-xs text-muted-foreground">{message.time}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="pr-12"
            />
            <Button type="submit" size="icon" className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
    </div>
  );
}
