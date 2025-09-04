
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { placeholderUsers, User } from "@/lib/placeholder-data";
import { Search } from "lucide-react";

export default function DiscoverPage() {
  const categories = ["All", "Design", "Writing", "Development"];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline-tech uppercase">Discover Talent</h1>
        <p className="mt-1 text-muted-foreground">
          Find the perfect collaborator for your next project.
        </p>
      </header>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, skill, or keyword..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="All" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black text-muted-foreground">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="All">
          <ProfileGrid users={placeholderUsers} />
        </TabsContent>
        <TabsContent value="Design">
          <ProfileGrid users={placeholderUsers.filter(u => u.category === 'design')} />
        </TabsContent>
        <TabsContent value="Writing">
          <ProfileGrid users={placeholderUsers.filter(u => u.category === 'writing')} />
        </TabsContent>
        <TabsContent value="Development">
          <ProfileGrid users={placeholderUsers.filter(u => u.category === 'development')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileGrid({ users }: { users: User[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {users.map((user) => (
        <ProfileCard key={user.id} user={user} />
      ))}
    </div>
  );
}

function ProfileCard({ user }: { user: User }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0 text-center">
        <div className="h-20 bg-muted-foreground/20" />
        <Avatar className="mx-auto -mt-10 h-20 w-20 border-4 border-card">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="p-4">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.headline}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {user.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
          <Link href={`/profile/${user.id}`} legacyBehavior={false}>
            <Button variant="outline" className="mt-6 w-full">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
