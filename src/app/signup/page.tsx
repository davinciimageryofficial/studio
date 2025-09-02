
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
  const { register, handleSubmit, control, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

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
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg className="size-7 text-primary" fill="currentColor" viewBox="0 0 256 256"><path d="M152,24a80,80,0,1,0,59.4,136H152V88a8,8,0,0,0,-16,0v72H68.6a80,80,0,1,0,83.4-136ZM128,200a64,64,0,1,1,64-64A64.07,64.07,0,0,1,128,200Z"></path></svg>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tighter">Join the Sentry Waitlist</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Get ready to connect, collaborate, and create with the best talent in the industry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Primary Profession</Label>
              <Select onValueChange={(value) => control._inputValues.profession = value} {...register("profession")}>
                <SelectTrigger id="profession">
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="writer">Writer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.profession && <p className="text-sm text-destructive">{errors.profession.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="early-access" {...register("earlyAccess")} />
              <Label htmlFor="early-access" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Sign up for early access to new features
              </Label>
            </div>
            <Button type="submit" className="w-full" size="lg">Join Waitlist</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
