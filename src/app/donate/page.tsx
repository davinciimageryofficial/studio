
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Gift } from "lucide-react";
import Link from "next/link";
import { ClientOnly } from "@/components/layout/client-only";
import { useToast } from "@/hooks/use-toast";

function DonatePageInternal() {
  const [donationAmount, setDonationAmount] = useState("15");
  const presetAmounts = ["5", "15", "50", "100"];
  const { toast } = useToast();

  const handlePresetClick = (amount: string) => {
    setDonationAmount(amount);
  };

  const handleDonateClick = () => {
    toast({
        title: "Feature Not Implemented",
        description: "Real payment processing is not available in this prototype.",
    });
  };

  return (
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center p-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Support Sentry's Development</CardTitle>
          <CardDescription className="mt-2 text-md text-muted-foreground">
            Your contribution helps us innovate faster and build the best platform for professionals like you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {presetAmounts.map((amount) => (
              <Button
                key={amount}
                variant={donationAmount === amount ? "default" : "outline"}
                className="h-14 text-lg"
                onClick={() => handlePresetClick(amount)}
              >
                ${amount}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-amount">Or enter a custom amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="custom-amount"
                type="number"
                placeholder="25.00"
                className="pl-7 text-base"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
              />
            </div>
          </div>
          <Button size="lg" className="w-full h-11 text-base" onClick={handleDonateClick}>
            <Gift className="mr-2 h-5 w-5" />
            Donate ${donationAmount}
          </Button>
           <Button asChild variant="link" className="w-full">
               <Link href="/">Maybe later, take me to the homepage</Link>
           </Button>
        </CardContent>
      </Card>
  );
}

export default function DonatePage() {
    return (
        <ClientOnly>
            <DonatePageInternal />
        </ClientOnly>
    )
}
