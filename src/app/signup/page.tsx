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
import { Kanban } from "lucide-react";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  profession: z.enum(["designer", "developer", "writer", "other"], {
    errorMap: () => ({ message: "Please select your profession." }),
  }),
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
      <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl">
          <CardHeader className="text-center p-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Kanban className="size-7 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tighter">Join the Sentry Waitlist</CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              Get ready to connect, collaborate, and create with the best talent in the industry.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Profession</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your profession" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="designer">Designer</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="writer">Writer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
    </ClientOnly>
  );
}
