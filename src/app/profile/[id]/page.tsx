import { placeholderUsers } from "@/lib/placeholder-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Mail, CheckCircle, MapPin, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const user = params.id === 'me' ? placeholderUsers[1] : placeholderUsers.find((u) => u.id === params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="bg-muted/40">
      {/* Cover Image */}
      <div className="relative h-48 w-full md:h-56">
        <Image
          src={user.coverImage}
          alt={`${user.name}'s cover image`}
          fill
          className="object-cover"
          data-ai-hint="abstract landscape"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Profile Header */}
          <div className="relative -mt-20 flex flex-col items-center gap-4 border-b border-border bg-card p-6 pb-6 sm:flex-row sm:items-end sm:gap-6 md:-mt-24 rounded-t-lg">
            <Avatar className="h-32 w-32 border-4 border-card md:h-36 md:w-36">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-5xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold md:text-3xl">{user.name}</h1>
              <p className="text-muted-foreground">{user.headline}</p>
              <div className="mt-2 flex items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                  <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>San Francisco, CA</span>
                  </div>
                   <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <a href="#" className="hover:underline">website.com</a>
                  </div>
              </div>
            </div>
            <div className="mt-4 flex w-full flex-shrink-0 gap-2 sm:mt-0 sm:w-auto">
              <Button className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" /> Connect
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="mr-2 h-4 w-4" /> Message
              </Button>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-8 lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{user.bio}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {user.portfolio.map((item, index) => (
                                <Link href="#" key={index} className="group relative block w-full aspect-video overflow-hidden rounded-lg">
                                    <Image src={item} alt={`Portfolio item ${index+1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint="design abstract" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Right Column */}
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {user.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Experience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                <Briefcase className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Senior Frontend Developer</h3>
                                <p className="text-sm text-muted-foreground">Innovate Inc.</p>
                                <p className="text-xs text-muted-foreground">Jan 2020 - Present · 4+ years</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                <Briefcase className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Web Developer</h3>
                                <p className="text-sm text-muted-foreground">Solutions Co.</p>
                                <p className="text-xs text-muted-foreground">Jun 2017 - Dec 2019 · 2.5 years</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
