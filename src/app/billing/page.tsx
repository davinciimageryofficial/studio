import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download } from "lucide-react";

export default function BillingPage() {
  const invoices = [
    { id: "INV-2024-001", date: "July 1, 2024", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-002", date: "June 1, 2024", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-003", date: "May 1, 2024", amount: "$99.00", status: "Paid" },
    { id: "INV-2024-004", date: "April 1, 2024", amount: "$99.00", status: "Paid" },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription, payment method, and view your billing history.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the Pro plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-muted-foreground">/ month</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    Your plan includes unlimited connections, advanced search filters, and access to AI Workmate Radar.
                    Your next billing date is August 1, 2024.
                </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel Subscription</Button>
              <Button>Upgrade Plan</Button>
            </CardFooter>
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
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.slice(0, 3).map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell className="text-right">{invoice.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        View All Invoices
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
