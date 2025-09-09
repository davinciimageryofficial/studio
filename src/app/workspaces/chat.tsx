
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Smile, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { placeholderUsers } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/context/workspace-context';

type Message = {
    user: typeof placeholderUsers[0];
    text: string;
    time: string;
};

export function Chat() {
    const { participants } = useWorkspace();
    const [messages, setMessages] = useState<Message[]>([
        { user: participants[0], text: "Hey everyone, ready to get started on the Q3 planning doc?", time: "10:01 AM" },
        { user: participants[2], text: "Yep, I have the latest version pulled up. Let's do it!", time: "10:02 AM" },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const currentUser = placeholderUsers[1]; // Bob as current user
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages([...messages, { user: currentUser, text: newMessage, time }]);
            setNewMessage("");
        }
    };

    return (
        <Card className="w-80 flex flex-col border-l rounded-none h-full">
            <CardHeader>
                <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                <ScrollArea className="h-full">
                    {messages.map((msg, index) => (
                        <div key={index} className="flex items-start gap-3 mb-4">
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.user.avatar} />
                                <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                    <p className="font-semibold text-sm">{msg.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{msg.time}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-muted text-sm">
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-2 border-t">
                 <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
                    <Input 
                        placeholder="Type a message..." 
                        className="flex-1"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}

