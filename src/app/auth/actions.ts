
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
    if (authError.message.includes("duplicate key value")) {
        return { error: "A user with this email already exists."}
    }
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "An unexpected error occurred during signup. Please try again."}
  }
  
  // Manually sign in the user after successful signup
  const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
  });

  if (signInError) {
      return { error: "Signup successful, but login failed. Please try logging in manually." };
  }

  // The handle_new_user trigger will create the profile automatically.
  // Now, add the user to the waitlist table.
  const { error: waitlistError } = await supabase.from('waitlist').insert({
      id: authData.user.id,
      email: email,
      full_name: fullName,
      profession: profession,
      wants_early_access: earlyAccess,
  });

  if (waitlistError) {
      // Even if waitlist fails, the user is signed up. We should probably handle this
      // more gracefully, but for now we'll just log it and continue.
      console.error("Error adding user to waitlist:", waitlistError.message);
  }

  revalidatePath('/', 'layout')
  return { success: true };
}

export async function logout() {
    const supabase = createSupabaseServerClient()
    await supabase.auth.signOut();
    revalidatePath('/', 'layout')
}
