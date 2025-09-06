'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Briefcase, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/logout');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </header>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your public profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Christian Peta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" defaultValue="Senior Frontend Developer | React & Next.js Expert" />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea id="bio" className="w-full min-h-24 p-2 border rounded-md" defaultValue="Building performant and scalable web applications. I love TypeScript and clean code. Always eager to learn new technologies."></textarea>
            </div>
             <Button>Save Changes</Button>
          </CardContent>
        </Card>
        
        <Separator />

        <Card>
            <CardHeader>
                <CardTitle>Verification</CardTitle>
                <CardDescription>Verify your place of work to add credibility to your profile and posts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert>
                    <Briefcase className="h-4 w-4" />
                    <AlertTitle>Current Verified Position</AlertTitle>
                    <AlertDescription>
                        <p className="font-semibold">Senior Frontend Developer at Innovate Inc.</p>
                        <p className="text-sm text-muted-foreground">Your position is verified and will be displayed on your profile.</p>
                    </AlertDescription>
                </Alert>
                <div className="space-y-2">
                    <Label htmlFor="work-email">Verify with a new work email</Label>
                    <div className="flex gap-2">
                        <Input id="work-email" type="email" placeholder="you@company.com" />
                        <Button variant="outline">Send Verification Email</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Separator />
        
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings and display preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="chris.peta@example.com" disabled />
              </div>
              <Button variant="outline">Change Password</Button>

              <div className="space-y-4 rounded-lg border p-4">
                  <h4 className="font-medium">Display Preferences</h4>
                  <div className="flex items-center justify-between">
                      <Label htmlFor="show-job-info" className="flex flex-col gap-1">
                          <span>Show position on posts</span>
                          <span className="font-normal text-muted-foreground text-xs">Display your verified job title and company next to your name on your posts.</span>
                      </Label>
                      <Switch id="show-job-info" defaultChecked />
                  </div>
              </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardFooter>
        </Card>


      </div>
    </div>
  );
}
