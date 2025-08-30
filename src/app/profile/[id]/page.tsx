import { placeholderUsers } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Mail, CheckCircle } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default function ProfilePage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch user data based on the id.
  // For this demo, we'll find the user in our placeholder data.
  // 'me' is a special id for the current user.
  const user = params.id === 'me' ? placeholderUsers[1] : placeholderUsers.find((u) => u.id === params.id);

  if (!user) {
    notFound();
  }

  return (
    <div>
      {/* Cover Image */}
      <div className="relative h-48 w-full md:h-64">
        <Image
          src={user.coverImage}
          alt={`${user.name}'s cover image`}
          fill
          className="object-cover"
          data-ai-hint="abstract landscape"
        />
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Profile Header */}
          <div className="relative -mt-20 flex flex-col items-center md:-mt-24 md:flex-row md:items-end">
            <Avatar className="h-32 w-32 border-4 border-background md:h-40 md:w-40">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-5xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center md:ml-6 md:flex-1 md:text-left">
              <h1 className="text-2xl font-bold md:text-3xl">{user.name}</h1>
              <p className="text-muted-foreground">{user.headline}</p>
            </div>
            <div className="mt-4 flex gap-2 md:mt-0">
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" /> Connect
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" /> Message
              </Button>
            </div>
          </div>
          
          <Card className="mt-8">
            <CardContent className="p-6">
                <h2 className="text-lg font-semibold">About</h2>
                <p className="mt-2 text-muted-foreground">{user.bio}</p>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="portfolio" className="mt-8 w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>
            
            <TabsContent value="portfolio" className="mt-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {user.portfolio.map((item, index) => (
                        <Card key={index} className="overflow-hidden">
                            <div className="aspect-video relative">
                                <Image src={item} alt={`Portfolio item ${index+1}`} fill className="object-cover" data-ai-hint="design abstract" />
                            </div>
                        </Card>
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="skills" className="mt-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map(skill => (
                                <Badge key={skill} variant="default" className="text-base px-4 py-2">{skill}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="experience" className="mt-6">
                 <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                <Briefcase className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Senior Frontend Developer</h3>
                                <p className="text-sm">Innovate Inc.</p>
                                <p className="text-xs text-muted-foreground">Jan 2020 - Present · 4+ years</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                <Briefcase className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Web Developer</h3>
                                <p className="text-sm">Solutions Co.</p>
                                <p className="text-xs text-muted-foreground">Jun 2017 - Dec 2019 · 2.5 years</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
