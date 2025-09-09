
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, CreditCard, Download, Gift, Heart, Star, PlusCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


const VisaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" role="img" aria-labelledby="pi-visa"><title id="pi-visa">Visa</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path d="M28.8 10.1c-.1-.3-.3-.5-.4-.7-.1-.2-.3-.4-.5-.5-.1-.1-.2-.3-.4-.4-.1-.1-.2-.2-.3-.2-.1-.1-.2-.1-.3-.1H18c-.3 0-.5.1-.7.2-.2.1-.3.3-.4.5-.1.2-.2.4-.2.6l.2 1.9c.1.2.2.4.3.5.1.1.3.2.4.2.1.1.2.1.3.1h1.4c-.1 1.5-.8 2.3-2 2.3-.6 0-1.1-.2-1.5-.5-.4-.3-.7-.7-.9-1.2l-.2-1.1c-.1-.3-.2-.5-.4-.7-.1-.2-.3-.3-.5-.4-.3-.1-.6-.2-.9-.2-.5 0-1 .1-1.4.3-.4.2-.7.5-1 .8-.3.3-.5.7-.7 1.1-.2.4-.3.8-.3 1.3l-.1 1.2c0 .4.1.8.3 1.2.2.4.5.7.8.9.3.2.7.3 1.1.3.4 0 .8-.1 1.1-.2.3-.1.6-.3.8-.5.2-.2.4-.5.5-.8.1-.3.2-.6.3-1l-.2-1.1c-.1-.2-.1-.4-.1-.5s0-.2.1-.3h1.2c.1.2.1.4.1.7l-.1 1.1c-.1.8-.4 1.4-1 1.9-.6.5-1.3.7-2.1.7-1.1 0-2.1-.4-2.8-1.1-.8-.8-1.2-1.8-1.2-3.1 0-1 .3-1.9.8-2.6.5-.7 1.2-1.2 2-1.5.8-.3 1.6-.4 2.5-.4.7 0 1.4.1 2 .3.6.2 1.1.5 1.5.9.4.4.7.9.9 1.4.2.5.3 1.1.3 1.7L30 10l-.1-1.8zM25.4 14.4l.2-1.7c-.1-.3-.2-.5-.3-.7-.1-.2-.2-.3-.4-.4-.1-.1-.2-.2-.3-.2-.1-.1-.2-.1-.3-.1h-1.4c.1 1.5.7 2.2 1.9 2.2.5 0 1-.2 1.3-.5.3-.3.5-.7.6-1.1l-.1-.9z" fill="#142688"></path></svg>
);
const MastercardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" role="img" aria-labelledby="pi-mastercard"><title id="pi-mastercard">Mastercard</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><circle fill="#EB001B" cx="15" cy="12" r="7"></circle><circle fill="#F79E1B" cx="23" cy="12" r="7"></circle><path fill="#FF5F00" d="M22 12c0-3.9-3.1-7-7-7s-7 3.1-7 7 3.1 7 7 7 7-3.1 7-7z"></path></svg>
);
const PayPalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" role="img" aria-labelledby="pi-paypal"><title id="pi-paypal">PayPal</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path fill="#003087" d="M23.9 8.6c.2-1.4-1.1-2.6-2.5-2.6H12c-.7 0-1.2.4-1.4 1l-2.4 11.2c-.2.7.3 1.4 1 1.4h3.1c.7 0 1.2-.4 1.4-1l.7-3.4c.2-.7.8-1.2 1.5-1.2h1.6c1.5 0 2.7-1 2.9-2.5l.2-1.1z"></path><path fill="#3086C8" d="M23.9 8.6c.2-1.4-1.1-2.6-2.5-2.6H12c-.7 0-1.2.4-1.4 1l-2.4 11.2c-.2.7.3 1.4 1 1.4h3.1c.7 0 1.2-.4 1.4-1l.7-3.4c.2-.7.8-1.2 1.5-1.2h1.6c1.5 0 2.7-1 2.9-2.5l.2-1.1z"></path><path fill="#009CDE" d="M23.3 8.1c.2-1.1-.5-2.1-1.6-2.1h-8.9c-.6 0-1.1.3-1.2.8l-2.2 10.3c-.2.6.3 1.2.9 1.2H14c.6 0 1.1-.3 1.2-.8l.7-3.4c.2-.6.7-1 1.3-1h1.5c1.2 0 2.2-.8 2.4-2l.2-1z"></path></svg>
);

function RequestPlatformDialog() {
  const { toast } = useToast();
  const [request, setRequest] = useState("");

  const handleSubmit = () => {
    if (request.trim()) {
      // In a real app, this would trigger an email or API call
      console.log("Payment platform request:", request);
      toast({
        title: "Request Sent",
        description: "Thank you for your feedback! We'll review your suggestion.",
      });
    }
  };

  return (
     <DialogContent>
      <DialogHeader>
        <DialogTitle>Request a Payment Platform</DialogTitle>
        <DialogDescription>
          Let us know which payment platform you'd like to see on Sentry.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-2">
        <Label htmlFor="request-details">Platform Name & Details</Label>
        <Textarea
          id="request-details"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="Please provide the name of the payment platform and any helpful details (e.g., website, country of use)."
          className="min-h-[100px]"
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" onClick={handleSubmit} disabled={!request.trim()}>Submit Request</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

function ContactSalesDialog() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim()) {
      console.log("Contact Sales message:", message);
      toast({
        title: "Message Sent",
        description: "Our sales team has received your message and will be in touch shortly.",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Contact Sales</DialogTitle>
        <DialogDescription>
          Tell us about your team's needs, and we'll get back to you with a custom plan.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-2">
        <Label htmlFor="sales-message">Your Requirements</Label>
        <Textarea
          id="sales-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your team size, required features, and any other specific needs..."
          className="min-h-[120px]"
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" onClick={handleSubmit} disabled={!message.trim()}>Send Message</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

function AddPaymentMethodDialog() {
  const { toast } = useToast();

  const handleAddPayment = () => {
    // In a real app, you would handle the form submission here.
    toast({
      title: "Payment Method Added",
      description: "Your new payment method has been saved successfully.",
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add a new payment method</DialogTitle>
        <DialogDescription>
          Securely add a new way to pay for your Sentry services.
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="card" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="card">Card</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
        </TabsList>
        <TabsContent value="card">
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="card-number">Card number</Label>
                    <Input id="card-number" placeholder="•••• •••• •••• ••••" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="expiry">Expires</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="name">Name on card</Label>
                    <Input id="name" placeholder="John Doe" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button onClick={handleAddPayment}>Add Card</Button>
                </DialogClose>
            </DialogFooter>
        </TabsContent>
        <TabsContent value="paypal">
            <div className="py-8 text-center">
                <p className="text-muted-foreground">You will be redirected to PayPal to complete the authorization.</p>
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button>Continue with PayPal</Button>
                </DialogClose>
            </DialogFooter>
        </TabsContent>
      </Tabs>
      <Separator className="my-4" />
        <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
                Don't see your preferred payment method?
            </p>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="link">
                        <Send className="mr-2 h-4 w-4" />
                        Request a new payment platform
                    </Button>
                </DialogTrigger>
                <RequestPlatformDialog />
            </Dialog>
        </div>
    </DialogContent>
  );
}

function UpgradeDialog({ plan, paymentMethods, onUpgrade }: { plan: any, paymentMethods: any[], onUpgrade: () => void }) {
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>(paymentMethods.find(p => p.isDefault)?.details);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upgrade to {plan.name}</DialogTitle>
        <DialogDescription>
          Confirm your payment details to upgrade to the {plan.name} plan for {plan.price}/month.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <Label>Select Payment Method</Label>
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-2">
          {paymentMethods.map((method, index) => (
            <div key={index} className="flex items-center space-x-2 rounded-md border p-4 has-[:checked]:border-primary">
              <RadioGroupItem value={method.details} id={`r-${index}`} />
              <Label htmlFor={`r-${index}`} className="flex items-center gap-4 w-full cursor-pointer">
                {method.type === 'visa' && <VisaIcon />}
                {method.type === 'mastercard' && <MastercardIcon />}
                {method.type === 'paypal' && <PayPalIcon />}
                <div className="flex-1">
                    <p className="font-semibold">{method.details}</p>
                    <p className="text-sm text-muted-foreground">
                        {method.type !== 'paypal' ? `Expires ${method.expiry}` : "Primary PayPal Account"}
                    </p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" onClick={onUpgrade} disabled={!selectedMethod}>Confirm Upgrade</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}


export default function BillingPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || "subscription";
  const { toast } = useToast();

  const invoices = [
    { id: "INV-2024-001", date: "July 1, 2024", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-002", date: "June 1, 2024", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-003", date: "May 1, 2024", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-004", date: "April 1, 2024", amount: "$99.00", status: "Paid" },
  ];

  const paymentMethods = [
    { type: 'visa', details: 'Visa ending in 1234', expiry: '08/2026', isDefault: true },
    { type: 'mastercard', details: 'Mastercard ending in 5678', expiry: '11/2025', isDefault: false },
    { type: 'paypal', details: 'chris.peta@example.com', isDefault: false },
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

  const handleUpgrade = (planName: string) => {
    toast({
      title: "Upgrade Successful!",
      description: `You have successfully upgraded to the ${planName} plan.`,
    });
    // Here you would typically update the user's subscription state
  };

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
                                        {plan.price === 'Custom' ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="w-full" variant="outline">Contact Sales</Button>
                                                </DialogTrigger>
                                                <ContactSalesDialog />
                                            </Dialog>
                                        ) : (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="w-full">Upgrade</Button>
                                                </DialogTrigger>
                                                <UpgradeDialog 
                                                    plan={plan} 
                                                    paymentMethods={paymentMethods} 
                                                    onUpgrade={() => handleUpgrade(plan.name)} 
                                                />
                                            </Dialog>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Manage your saved payment options.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {paymentMethods.map((method, index) => (
                            <div key={index} className="flex items-center gap-4 rounded-md border p-4">
                                {method.type === 'visa' && <VisaIcon />}
                                {method.type === 'mastercard' && <MastercardIcon />}
                                {method.type === 'paypal' && <PayPalIcon />}
                                <div className="flex-1">
                                    <p className="font-semibold">{method.details}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {method.type !== 'paypal' ? `Expires ${method.expiry}` : "Primary PayPal Account"}
                                    </p>
                                </div>
                                {method.isDefault && <Badge variant="secondary">Default</Badge>}
                                <Button variant="outline">Update</Button>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Payment Method
                                </Button>
                            </DialogTrigger>
                            <AddPaymentMethodDialog />
                        </Dialog>
                    </CardFooter>
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
    
    
