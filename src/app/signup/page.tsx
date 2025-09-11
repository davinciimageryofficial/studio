
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ClientOnly } from "@/components/layout/client-only";
import { Kanban, Languages } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  userType: z.enum(["business", "freelancer"], {
    errorMap: () => ({ message: "Please select an option." }),
  }),
  profession: z.enum(["design", "development", "writing", "marketing", "business", "other"], {
    errorMap: () => ({ message: "Please select your primary work category." }),
  }),
  niche: z.string().min(2, "Please specify your niche or role."),
  earlyAccess: z.boolean().default(false),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      niche: "",
      earlyAccess: false,
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
    console.log("Signup submission:", data);

    // Store data in localStorage to pass to the confirmation page
    localStorage.setItem("waitlistData", JSON.stringify(data));
    
    toast({
      title: "You're on the list!",
      description: "Thanks for joining the Sentry waitlist. We'll be in touch soon.",
    });

    router.push('/waitlist-confirmation');
  };

  return (
    <ClientOnly>
      <div className="w-full bg-background">
         <div className="absolute top-6 right-6 z-10">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="icon">
                        <Languages className="h-5 w-5" />
                        <span className="sr-only">Change language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>English</DropdownMenuItem>
                    <DropdownMenuItem>Español</DropdownMenuItem>
                    <DropdownMenuItem>简体中文 (Mandarin)</DropdownMenuItem>
                    <DropdownMenuItem>ChiShona</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="grid min-h-screen lg:grid-cols-2">
          <div className="flex items-center justify-center p-8 sm:p-12">
            <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
              <CardHeader className="text-center p-0 mb-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <Kanban className="size-7 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold tracking-tighter">Join the Sentry Waitlist</CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">
                  Get ready to connect, collaborate, and create with the best talent in the industry.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                      control={control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Jane Doe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} placeholder="e.g., you@company.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="business">Business (hiring for projects)</SelectItem>
                              <SelectItem value="freelancer">Freelancer (looking for work)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Work Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your main field of work" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="design">Design & Creative</SelectItem>
                              <SelectItem value="development">Development & IT</SelectItem>
                              <SelectItem value="writing">Writing & Content Creation</SelectItem>
                              <SelectItem value="marketing">Marketing & Sales</SelectItem>
                              <SelectItem value="business">Business & Consulting</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={control}
                      name="niche"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Niche / Role</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., UI/UX Designer, React Developer, SEO Specialist" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="earlyAccess"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Sign up for early access to new features
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" size="lg">Join Waitlist</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="relative hidden lg:flex items-center justify-center bg-muted/20 p-8">
              <Kanban className="size-48 text-muted-foreground/40" />
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
