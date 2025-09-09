
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, CreditCard, Download, Gift, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function BillingPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || "subscription";

  const invoices = [
    { id: "INV-2024-001", date: "July 1, 2024", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-002", date: "June 1, 2024", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-003", date: "May 1, 2024", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-004", date: "April 1, 2024", amount: "$99.00", status: "Paid" },
  ];

  const plans = [
    {
      name: "Basic",
      price: "$29",
      features: [
        "10 Connections per month",
        "Basic Search Filters",
        "Limited Profile Views",
      ],
      current: false,
    },
    {
      name: "Pro",
      price: "$99",
      features: [
        "Unlimited Connections",
        "Advanced Search Filters",
        "Access to AI Workmate Radar",
        "Full Profile Analytics",
      ],
      current: true,
    },
    {
      name: "Team",
      price: "$249",
      features: [
        "All Pro features",
        "Up to 5 team members",
        "Team collaboration tools",
        "Priority Support",
      ],
      current: false,
    },
    {
        name: "Enterprise",
        price: "Custom",
        features: [
          "All Team features",
          "Unlimited team members",
          "Dedicated Account Manager",
          "Custom Integrations",
        ],
        current: false,
    },
  ];
  const currentPlan = plans.find(p => p.current);
  const otherPlans = plans.filter(p => !p.current);

  return (
    <div className="p-4 sm:p-6 md:p-8 h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Donations</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription, make a donation, and view your billing history.
        </p>
      </header>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm bg-black text-muted-foreground">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="donate">Donate</TabsTrigger>
        </TabsList>
        <TabsContent value="subscription" className="mt-6">
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                {/* Current Plan */}
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription className="text-primary-foreground/80">You are currently on the <strong>{currentPlan?.name}</strong> plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">{currentPlan?.price}</span>
                            <span className="text-primary-foreground/70">/ month</span>
                        </div>
                        <ul className="space-y-2 text-sm text-primary-foreground/80">
                            {currentPlan?.features.map(feature => (
                                <li key={feature} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                    <Button variant="secondary">Cancel Subscription</Button>
                    </CardFooter>
                </Card>

                {/* Available Plans */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Plans</CardTitle>
                            <CardDescription>Choose the plan that's right for you.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {otherPlans.map(plan => (
                                <Card key={plan.name} className={cn("flex flex-col", plan.name === "Pro" && "border-primary")}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                        {plan.name}
                                        {plan.name === 'Pro' && <Star className="h-5 w-5 text-primary" />}
                                        </CardTitle>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">{plan.price}</span>
                                            {plan.price !== 'Custom' && <span className="text-muted-foreground">/ month</span>}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-3">
                                        {plan.features.map(feature => (
                                            <p key={feature} className="text-sm text-muted-foreground">{feature}</p>
                                        ))}
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant={plan.price === 'Custom' ? 'outline' : 'default'}>
                                        {plan.price === 'Custom' ? 'Contact Sales' : 'Upgrade'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Update your payment details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 rounded-md border p-4">
                            <CreditCard className="h-6 w-6" />
                            <div className="flex-1">
                                <p className="font-semibold">Visa ending in 1234</p>
                                <p className="text-sm text-muted-foreground">Expires 08/2026</p>
                            </div>
                            <Button variant="outline">Update</Button>
                        </div>
                    </CardContent>
                </Card>
                </div>

                {/* Billing History Side */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing History</CardTitle>
                            <CardDescription>View and download your past invoices.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {invoices.map((invoice, index) => (
                                <div key={invoice.id}>
                                    <div className="flex items-center justify-between">
                                        <div className="grid gap-1">
                                            <p className="font-semibold">{invoice.id}</p>
                                            <p className="text-sm text-muted-foreground">{invoice.date} - {invoice.amount}</p>
                                        </div>
                                        <Button variant="outline" size="icon">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {index < invoices.length - 1 && <Separator className="mt-4" />}
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">
                                View All Invoices
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="donate" className="mt-6">
             <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                        <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Support Sentry</CardTitle>
                    <CardDescription>
                        Your contributions help us build a better platform for everyone.
                        Thank you for your generosity!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-center text-muted-foreground">
                        To make a donation, please visit our dedicated donation page.
                    </p>
                    <Button size="lg" className="w-full" asChild>
                        <Link href="/donate">
                             <Gift className="mr-2 h-5 w-5" />
                            Go to Donation Page
                        </Link>
                    </Button>
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
