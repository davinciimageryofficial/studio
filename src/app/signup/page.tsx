
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { Kanban, Loader2 } from "lucide-react";
import { signup } from "@/app/auth/actions";
import { useState } from "react";
import { ClientOnly } from "@/components/layout/client-only";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/language-context";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  profession: z.string().min(1, "Please select your profession."),
  earlyAccess: z.boolean().default(false),
});

type SignupFormValues = z.infer<typeof signupSchema>;

function SignupPageInternal() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { translations: t } = useLanguage();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      profession: undefined,
      earlyAccess: false,
    },
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('profession', data.profession);
    formData.append('earlyAccess', String(data.earlyAccess));
    
    const result = await signup(formData);
    setIsSubmitting(false);

    if (result?.error) {
        setErrorMessage(result.error);
    } else if (result?.success) {
        toast({
            title: t.signupSuccessToastTitle,
            description: t.signupSuccessToastDesc,
        });
        // Store data for confirmation page
        localStorage.setItem("waitlistData", JSON.stringify(data));
        router.push('/waitlist-confirmation');
    }
  };

  return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <Kanban className="size-7 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">{t.signupTitle}</CardTitle>
                <CardDescription>{t.signupDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <fieldset disabled={isSubmitting} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t.signupFullName}</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder={t.signupFullNamePlaceholder} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t.signupEmail}</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} placeholder={t.signupEmailPlaceholder} />
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
                        <FormField
                        control={form.control}
                        name="profession"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t.signupProfession}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t.signupProfessionPlaceholder} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="design">{t.signupProfessionDesign}</SelectItem>
                                        <SelectItem value="development">{t.signupProfessionDev}</SelectItem>
                                        <SelectItem value="writing">{t.signupProfessionWriting}</SelectItem>
                                        <SelectItem value="marketing">{t.signupProfessionMarketing}</SelectItem>
                                        <SelectItem value="business">{t.signupProfessionBusiness}</SelectItem>
                                        <SelectItem value="other">{t.signupProfessionOther}</SelectItem>
                                    </SelectContent>
                                </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="earlyAccess"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                    {t.signupEarlyAccess}
                                    </FormLabel>
                                </div>
                                </FormItem>
                            )}
                        />
                    </fieldset>
                    {errorMessage && (
                        <p className="text-sm font-medium text-destructive">{errorMessage}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Joining..." : t.joinWaitlist}
                    </Button>
                  </form>
                </Form>
                 <p className="mt-4 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="underline hover:text-primary">
                    Log in
                    </Link>
                </p>
            </CardContent>
        </Card>
    </div>
  );
}

export default function SignupPage() {
    return (
        <ClientOnly>
            <SignupPageInternal />
        </ClientOnly>
    )
}
