
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

export async function googleSignIn() {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    });

    if (error) {
        console.error('Google Sign-In Error:', error);
        return { error: 'Could not authenticate with Google. Please try again.' };
    }

    if (data.url) {
        redirect(data.url);
    }
    
    return { error: 'An unknown error occurred.' };
}

export async function signup(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const profession = formData.get('profession') as string;
    const earlyAccess = formData.get('earlyAccess') === 'true';

    const supabase = createSupabaseServerClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    });

    if (authError) {
        if (authError.message.includes("User already registered")) {
            return { error: "A user with this email already exists. Please log in." };
        }
        return { error: authError.message };
    }

    if (!authData.user) {
        return { error: 'Signup successful, but no user data returned. Please try logging in.' };
    }

    // Now, create the public profile for the new user.
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({ 
            id: authData.user.id, 
            full_name: fullName, 
            category: profession,
            email: email,
            headline: `New ${profession} on Sentry`,
            bio: 'Just joined Sentry! Looking to connect and collaborate.',
            skills: [profession],
            reliability_score: 80,
            community_standing: "New member with a clean record.",
            disputes: 0,
            avatar_url: `https://picsum.photos/seed/${authData.user.id}/200/200`,
            status: 'pending_verification',
        });
    
    if (profileError) {
        console.error("Error creating profile:", profileError);
        // This is a critical failure, as auth user exists without a profile.
        // In a real-world scenario, you might want to delete the auth user here or have a cleanup job.
        return { error: `Database error saving new user: ${profileError.message}` };
    }

    if (earlyAccess) {
        const { error: waitlistError } = await supabase
            .from('waitlist')
            .insert({ user_id: authData.user.id, email: email, status: 'pending_verification' });
        if (waitlistError) {
            // This is not a fatal error, just a warning.
            console.warn("Could not add user to early access waitlist:", waitlistError);
        }
    }

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

    // The user might not be "active" yet, but they have an auth session
    // after signing up. This check is correct; we just need a session to exist.
    if (!user) {
        return { error: 'You must sign up or log in before verifying an access code.' };
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
    
    // 4. Update the waitlist entry as well, if it exists
    await supabase
        .from('waitlist')
        .update({ status: 'activated_via_code' })
        .eq('user_id', user.id);


    revalidatePath('/dashboard', 'layout');
    return { success: true };
}
