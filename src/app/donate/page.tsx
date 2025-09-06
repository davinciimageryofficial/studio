
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Gift } from "lucide-react";
import Link from "next/link";

export default function DonatePage() {
  const [donationAmount, setDonationAmount] = useState("15");
  const presetAmounts = ["5", "15", "50", "100"];

  const handlePresetClick = (amount: string) => {
    setDonationAmount(amount);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Support Sentry's Development</CardTitle>
          <CardDescription className="mt-2 text-lg text-muted-foreground">
            Sentry is built for the community. Your contribution helps us innovate faster and build the best platform for professionals like you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {presetAmounts.map((amount) => (
              <Button
                key={amount}
                variant={donationAmount === amount ? "default" : "outline"}
                className="h-16 text-xl"
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
                className="pl-7 text-lg"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
              />
            </div>
          </div>
          <Button size="lg" className="w-full h-12 text-lg">
            <Gift className="mr-2 h-5 w-5" />
            Donate ${donationAmount}
          </Button>
           <Button asChild variant="link" className="w-full">
               <Link href="/">Maybe later, take me to the homepage</Link>
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}
