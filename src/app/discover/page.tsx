
'use client';

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, User as UserIcon, MoreHorizontal, Flag, ShieldX } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";
import { ClientOnly } from "@/components/layout/client-only";
import { useState, useEffect } from "react";
import { getUsers } from "@/lib/database";
import { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function DiscoverPageInternal({ initialUsers }: { initialUsers: User[] }) {
  const { language } = useLanguage();
  const t = translations[language];
  const categories = ["All", "Design", "Writing", "Development"];
  
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const handleAction = (action: string, userName: string) => {
    toast({
      title: `${t.action}: ${action}`,
      description: `${t.actionDesc.replace('{action}', action).replace('{userName}', userName)}`,
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesCategory = activeTab === "All" || user.category === activeTab.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.headline && user.headline.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.skills && user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline-tech uppercase">{t.discoverTitle}</h1>
        <p className="mt-1 text-muted-foreground">
          {t.discoverDescription}
        </p>
      </header>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder={t.discoverSearchPlaceholder} 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black text-muted-foreground">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <ProfileGridSkeleton />
          ) : (
            <ProfileGrid users={filteredUsers} handleAction={handleAction} t={t} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default async function DiscoverPage() {
    const users = await getUsers();
    return (
        <ClientOnly>
            <DiscoverPageInternal initialUsers={users} />
        </ClientOnly>
    )
}

function ProfileGrid({ users, handleAction, t }: { users: User[], handleAction: (action: string, userName: string) => void, t: typeof translations['en'] }) {
  if (users.length === 0) {
    return <p className="text-center text-muted-foreground">No users found.</p>
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {users.map((user) => (
        <ProfileCard key={user.id} user={user} handleAction={handleAction} t={t} />
      ))}
    </div>
  );
}

function ProfileGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0 text-center">
            <Skeleton className="h-20 w-full" />
            <div className="mx-auto -mt-10 h-20 w-20 rounded-full border-4 border-card bg-background flex items-center justify-center">
              <Skeleton className="h-full w-full rounded-full" />
            </div>
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full mx-auto" />
              <div className="mt-4 flex flex-wrap justify-center gap-2 pt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
              <Skeleton className="h-10 w-full mt-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ProfileCard({ user, handleAction, t }: { user: User, handleAction: (action: string, userName: string) => void, t: typeof translations['en'] }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0 text-center relative">
        <div className="absolute top-2 right-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleAction('Report', user.name)}>
                        <Flag className="mr-2 h-4 w-4" />
                        <span>{t.reportUser}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('Block', user.name)} className="text-destructive">
                        <ShieldX className="mr-2 h-4 w-4" />
                        <span>{t.blockUser}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="h-20 bg-muted-foreground/20" />
        <Avatar className="mx-auto -mt-10 h-20 w-20 border-4 border-card">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            <UserIcon className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <div className="p-4">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.headline}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {(user.skills || []).slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
          <Link href={`/profile/${user.id}`} legacyBehavior={false}>
            <Button variant="outline" className="mt-6 w-full">
              {t.viewProfile}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
