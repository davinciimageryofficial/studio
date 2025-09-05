
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ClientOnly } from "@/components/layout/client-only";

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

  const { handleSubmit, control, formState: { errors } } = form;

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
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-lg shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg className="size-7 text-primary" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" opacity="0.2"></path>
                  <path d="M152.2,60.2a52,52,0,0,0-73.5,73.5l-2.3,2.3a12,12,0,0,0,0,17,12,12,0,0,0,17,0l2.3-2.3a52,52,0,0,0,73.5-73.5l2.3-2.3a12,12,0,0,0-17-17ZM135.2,149a28,28,0,0,1-39.6-39.6l19.8-19.8a28,28,0,0,1,39.6,39.6Z"></path>
                  <path d="M103.8,195.8a52,52,0,0,0,73.5-73.5l2.3-2.3a12,12,0,0,0-17-17l-2.3,2.3a52,52,0,0,0-73.5,73.5l-2.3,2.3a12,12,0,1,0,17,17Z" opacity="0.2"></path>
                  <path d="M198,34s-4,6-8,8-10,0-10,0l-2,4a80.14,80.14,0,0,0-28,16l-4-2s-6-4-8-2-4,10-4,10l-4,2a80.14,80.14,0,0,0-16,28l-2,4s-4-4-10-4-8,2-8,2l-4,2a80.14,80.14,0,0,0-16,28l-2,4s-6-4-8-2-4,10-4,10l-2,4a80.14,80.14,0,0,0,16,28l4,2s4,6,2,8,10,4,10,4l4-2a80.14,80.14,0,0,0,28-16l2-4s4,4,10,4,8-2,8-2l4-2a80.14,80.14,0,0,0,28-16l2-4s4-4,8-2,4,10,4,10l2-4a80.14,80.14,0,0,0,16-28l2-4s-4-6-2-8-10-4-10-4l-4,2a80.14,80.14,0,0,0-28,16l-2,4s-4,4-8,2-4-10-4-10l-2-4a80.14,80.14,0,0,0-16-28Z" opacity="0.2"></path>
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tighter">Join the Sentry Waitlist</CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              Get ready to connect, collaborate, and create with the best talent in the industry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
