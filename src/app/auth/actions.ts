
'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation';

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
  // The handle_new_user trigger in Supabase will automatically create their profile
  // and add them to the waitlist.
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: fullName,
        category: profession,
        // The trigger will use this metadata
        wants_early_access: earlyAccess,
      },
    },
  })

  if (authError) {
    // If user is already registered, this is not a fatal error for this flow.
    // We can proceed to sign them in.
    if (!authError.message.includes("User already registered")) {
       return { error: authError.message };
    }
  }

  // If we are here, it means either the user is new (and an email has been sent)
  // or they already exist. In either case, we now sign them in to create an active session.
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
  });

  if (signInError) {
      // This might happen if they use the wrong password for an existing account.
      return { error: signInError.message };
  }
  
  if (!signInData.user) {
    return { error: "An unexpected error occurred after login. Please try again."}
  }

  revalidatePath('/', 'layout')
  return { success: true };
}

export async function logout() {
    const supabase = createSupabaseServerClient()
    await supabase.auth.signOut();
    revalidatePath('/', 'layout')
}

export async function verifyAccessCode(accessCode: string) {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'You must be logged in to verify an access code.' };
    }

    // 1. Check if the access code exists and is not yet redeemed
    const { data: codeData, error: codeError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', accessCode)
        .is('redeemed_by', null)
        .single();

    if (codeError || !codeData) {
        return { error: 'Invalid or already used access code.' };
    }

    // 2. Mark the code as redeemed by the current user
    const { error: updateError } = await supabase
        .from('access_codes')
        .update({ redeemed_by: user.id, redeemed_at: new Date().toISOString() })
        .eq('id', codeData.id);

    if (updateError) {
        console.error('Error redeeming access code:', updateError);
        return { error: 'Could not redeem the access code. Please try again.' };
    }
    
    // 3. Update the user's profile to grant access (optional, depends on your schema)
    // For example, you might have a 'status' or 'has_access' column on the profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ status: 'active' }) // Assuming a 'status' column exists
        .eq('id', user.id);
        
    if (profileError) {
      // Not a fatal error, but should be logged
      console.error('Failed to update user profile status after code redemption:', profileError);
    }

    revalidatePath('/dashboard');
    return { success: true };
}
