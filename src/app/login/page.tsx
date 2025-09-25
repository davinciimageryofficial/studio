
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { login, googleSignIn } from "@/app/auth/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Kanban, Loader2 } from "lucide-react";
import { useState } from "react";
import { ClientOnly } from "@/components/layout/client-only";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691c-1.217 2.45-1.911 5.2-1.911 8.169s.694 5.719 1.911 8.169L.641 36.891C.22 34.618 0 32.222 0 29.5s.22-5.118.641-7.391l5.665-4.418z" />
        <path fill="#4CAF50" d="M24 48c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 40.603 26.715 42 24 42c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 43.477 16.227 48 24 48z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginPageInternal() {
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const result = await login(formData);
    
    setIsSubmitting(false);

    if (result?.error) {
      setErrorMessage(result.error);
    } else if (result?.success) {
      router.refresh(); // This will re-fetch server components and re-run middleware
    }
  };

  const handleGoogleSignIn = async () => {
    await googleSignIn();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Kanban className="size-7 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleGoogleSignIn}>
              <Button type="submit" variant="outline" className="w-full">
                  <GoogleIcon />
                  Sign in with Google
              </Button>
          </form>
          <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <fieldset disabled={isSubmitting} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} placeholder="you@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} placeholder="••••••••" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>
              {errorMessage && (
                  <p className="text-sm font-medium text-destructive">{errorMessage}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Logging In..." : "Log In"}
              </Button>
            </form>
          </Form>
           <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="underline hover:text-primary">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
    return (
        <ClientOnly>
            <LoginPageInternal />
        </ClientOnly>
    );
}

    