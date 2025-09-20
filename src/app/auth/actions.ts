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
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const profession = formData.get('profession') as string;
    const earlyAccess = formData.get('earlyAccess') === 'true';

    const supabase = createSupabaseServerClient();

    // First, try to sign up the user for authentication.
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    });

    if (authError) {
        // If the error is "User already registered", try to log them in.
        if (authError.message.includes("User already registered")) {
            console.log("User already exists. Attempting to sign in...");
            return await login(formData);
        }
        // For any other auth error, return it to the user.
        return { error: authError.message };
    }

    if (!authData.user) {
        return { error: 'Signup successful, but no user data returned. Please try logging in.' };
    }

    // Second, if auth succeeds, create the user's public profile.
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({ 
            id: authData.user.id, 
            full_name: fullName, 
            category: profession,
            email: email, // Assuming you store email in profiles table as well
            // Set default values for other profile fields
            headline: `New ${profession} on Sentry`,
            bio: 'Just joined Sentry! Looking to connect and collaborate.',
            skills: [profession],
            reliability_score: 80,
            community_standing: "New member with a clean record.",
            disputes: 0,
            avatar_url: `https://picsum.photos/seed/${authData.user.id}/200/200`
        });
    
    if (profileError) {
        // This is where the "Database error saving new user" comes from.
        console.error("Error creating profile:", profileError);
        // Provide the actual database error message for better debugging
        return { error: `Database error: ${profileError.message}` };
    }

    // Optionally handle the waitlist table if it's still in use
    if (earlyAccess) {
        const { error: waitlistError } = await supabase
            .from('waitlist')
            .insert({ user_id: authData.user.id, email: email }); // Also inserting email for reference
        if (waitlistError) {
            // Not a fatal error, but good to log.
            console.warn("Could not add user to early access waitlist:", waitlistError);
        }
    }

    // If signup was successful, revalidate and return success.
    // The user will need to confirm their email.
    revalidatePath('/', 'layout');
    return { success: true, pendingConfirmation: true };
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
    
    // 3. Update the user's profile to grant access
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', user.id);
        
    if (profileError) {
      // Not a fatal error, but should be logged
      console.error('Failed to update user profile status after code redemption:', profileError);
    }

    revalidatePath('/dashboard');
    return { success: true };
}
