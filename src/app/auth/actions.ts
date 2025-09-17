
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

  // First, sign up the user in auth.users
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
    if (authError.message.includes("User already registered")) {
        // This is not a fatal error, the user might be re-trying.
        // We can proceed to try and sign them in and upsert their waitlist status.
    } else {
       return { error: authError.message };
    }
  }

  // Manually sign in the user after successful signup or if they already exist.
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
  });

  if (signInError) {
      return { error: "Login failed. Please check your credentials and try logging in manually." };
  }
  
  const user = signInData.user;
  if (!user) {
    return { error: "An unexpected error occurred after login. Please try again."}
  }

  // The handle_new_user trigger will create the profile automatically.
  // Now, add the user to the waitlist table using upsert to prevent duplicate errors.
  const { error: waitlistError } = await supabase.from('waitlist').upsert({
      id: user.id,
      email: email,
      full_name: fullName,
      profession: profession,
      wants_early_access: earlyAccess,
  }, { onConflict: 'id' });

  if (waitlistError) {
      // This is a critical error.
      console.error("Database error saving new user to waitlist:", waitlistError.message);
      return { error: "Database error saving new user. Please contact support."}
  }

  revalidatePath('/', 'layout')
  return { success: true };
}

export async function logout() {
    const supabase = createSupabaseServerClient()
    await supabase.auth.signOut();
    revalidatePath('/', 'layout')
}
