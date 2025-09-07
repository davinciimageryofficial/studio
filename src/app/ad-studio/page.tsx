
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Eye, DollarSign, Target, MousePointerClick, Lightbulb } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const campaigns = [
  { name: "Summer Sale Promotion", status: "Active", type: "Banner Ad", spend: "$500", conversions: 25 },
  { name: "Freelancer Profile Boost", status: "Active", type: "Profile Spotlight", spend: "$150", conversions: 120 },
  { name: "New Product Launch", status: "Paused", type: "Product Listing", spend: "$1,200", conversions: 88 },
  { name: "Tech Blog Sponsored Post", status: "Finished", type: "Sponsored Content", spend: "$800", conversions: 450 },
];

export default function AdStudioPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">AD-Sentry Studio</h1>
            <p className="mt-1 text-muted-foreground">
                Manage your AI-powered ad campaigns to promote your profile or services.
            </p>
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Campaign
                </Button>
            </DialogTrigger>
            <CreateCampaignDialog />
        </Dialog>
      </header>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="audiences">Audiences</TabsTrigger>
          <TabsTrigger value="billing">Billing & Ads</TabsTrigger>
        </TabsList>
        <TabsContent value="campaigns" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Campaigns</CardTitle>
                    <CardDescription>An overview of all your ad campaigns.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campaign Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Spend</TableHead>
                                <TableHead>Conversions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaigns.map(campaign => (
                                <TableRow key={campaign.name}>
                                    <TableCell className="font-medium">{campaign.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                                            {campaign.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{campaign.type}</TableCell>
                                    <TableCell>{campaign.spend}</TableCell>
                                    <TableCell>{campaign.conversions}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                    <CardDescription>Track the performance of your campaigns in real-time.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1.2M</div>
                            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$2,650</div>
                             <p className="text-xs text-muted-foreground">+40% from last month</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+685</div>
                             <p className="text-xs text-muted-foreground">+22.1% from last month</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
                            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2.8%</div>
                             <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="audiences" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Audience Management</CardTitle>
                    <CardDescription>Create and manage your target audiences for ad campaigns.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-96 flex items-center justify-center text-muted-foreground">
                    <p>Audience creation and targeting tools will be available here.</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="billing" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Billing & Ads</CardTitle>
                    <CardDescription>Manage your payment methods and view your transaction history for ad spend.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-96 flex items-center justify-center text-muted-foreground">
                    <p>Ad billing and payment management will be available here.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateCampaignDialog() {
    return (
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>Create a New Ad Campaign</DialogTitle>
                <DialogDescription>
                    Set up your campaign details, ad creative, and targeting options.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                {/* Main Form */}
                <div className="md:col-span-2 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="campaign-name">Campaign Name</Label>
                        <Input id="campaign-name" placeholder="e.g., Summer Freelance Promotion" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ad-type">Ad Type</Label>
                        <Select>
                            <SelectTrigger id="ad-type">
                                <SelectValue placeholder="Select an ad format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="banner">Banner Ad</SelectItem>
                                <SelectItem value="profile-spotlight">Profile Spotlight Ad</SelectItem>
                                <SelectItem value="product-listing">Product Listing Ad</SelectItem>
                                <SelectItem value="sponsored-content">Sponsored Content</SelectItem>
                                <SelectItem value="job-gig">Job or Gig Ad</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ad-content">Ad Content</Label>
                        <Textarea id="ad-content" placeholder="Write your ad copy here. What makes your service or profile unique?" className="min-h-32" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="targeting-keywords">Targeting Keywords</Label>
                        <Input id="targeting-keywords" placeholder="e.g., React developer, UI/UX design, copywriter" />
                    </div>
                </div>
                {/* Pocket Guide */}
                <div className="space-y-4 md:border-l md:pl-6">
                     <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        Pocket Guide
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-4">
                         <p>As you fill out the form, I'll provide live feedback and suggestions here to help you create a successful ad campaign.</p>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Launch Campaign</Button>
            </DialogFooter>
        </DialogContent>
    );
}
