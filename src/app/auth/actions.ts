
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

  // The handle_new_user function and trigger will now automatically create the profile.
  // So we just need to sign up the user.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: fullName,
      }
    },
  })

  if (error) {
    // The trigger might fail silently, so if we get a user back but no profile,
    // we can still return a generic error. The most common issue is RLS.
    if (error.message.includes("duplicate key value")) {
        return { error: "A user with this email already exists."}
    }
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "An unexpected error occurred during signup. Please try again."}
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
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
