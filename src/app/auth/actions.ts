
'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createServerClient } from '@supabase/ssr'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string;
  const profession = formData.get('profession') as string;
  const earlyAccess = formData.get('earlyAccess') === 'true';

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )

  // First, sign up the user in auth.users
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: fullName,
        category: profession,
      }
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
  redirect('/waitlist-confirmation')
}

export async function logout() {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            get(name: string) {
            return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options) {
            cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options) {
            cookieStore.delete({ name, ...options })
            },
        },
        }
    )

    await supabase.auth.signOut();
    redirect('/logout');
}
