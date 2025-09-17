
'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout')
  return { success: true };
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string;
  const profession = formData.get('profession') as string;
  const earlyAccess = formData.get('earlyAccess') === 'true';

  const supabase = createSupabaseServerClient()

  // First, try to sign up the user in auth.users
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: fullName,
        category: profession,
      },
    },
  })

  if (authError) {
    // If the user is already registered, this is not a fatal error.
    // We can proceed to sign them in and update their waitlist status.
    if (!authError.message.includes("User already registered")) {
       return { error: authError.message };
    }
  }

  // Manually sign in the user. This works for both new signups (if email confirmation is disabled)
  // and for existing users who are trying to sign up again.
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
  });

  if (signInError) {
      return { error: "Login failed after signup attempt. Please check your credentials and try logging in manually." };
  }
  
  const user = signInData.user;
  if (!user) {
    return { error: "An unexpected error occurred after login. Please try again."}
  }

  // Now, use upsert to add the user to the waitlist table, preventing duplicate errors.
  // The handle_new_user trigger will create the profile automatically on first signup.
  const { error: waitlistError } = await supabase.from('waitlist').upsert({
      id: user.id,
      email: email,
      full_name: fullName,
      profession: profession,
      wants_early_access: earlyAccess,
  }, { onConflict: 'id' });

  if (waitlistError) {
      console.error("Database error saving user to waitlist:", waitlistError.message);
      return { error: "A database error occurred while saving your information. Please contact support."}
  }

  revalidatePath('/', 'layout')
  return { success: true };
}

export async function logout() {
    const supabase = createSupabaseServerClient()
    await supabase.auth.signOut();
    revalidatePath('/', 'layout')
}
