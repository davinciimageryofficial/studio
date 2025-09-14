
'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { placeholderUsers } from './placeholder-data';
import type { User, Post, Course } from './placeholder-data';

/**
 * Creates a Supabase client for server-side operations.
 * This is used for all database interactions that happen in Server Components or Server Actions.
 */
function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
            cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options) {
            cookieStore.delete({ name, ...options })
        },
      },
    }
  );
}

/**
 * Fetches the current authenticated user's profile.
 * If no user is logged in, or no profile exists, it returns a default user.
 */
export async function getCurrentUser(): Promise<User> {
    const supabase = createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        // Return a default guest user if not logged in
        return placeholderUsers[1];
    }
    
    const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
    
    if (error || !userProfile) {
        console.warn("Could not fetch user profile, returning placeholder.", error);
        // Return a placeholder but with the correct ID if profile is missing
        return { ...placeholderUsers[1], id: authUser.id, name: userProfile?.full_name || authUser.email || 'New User' };
    }

    // Map full_name to name
    const { full_name, ...rest } = userProfile;

    return { ...rest, name: full_name } as User;
}

/**
 * Fetches all users from the database, excluding the current user.
 */
export async function getOtherUsers(): Promise<User[]> {
    const supabase = createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    let query = supabase.from('profiles').select('id, full_name, headline, avatar, category, reliability_score');
    if (authUser) {
        query = query.neq('id', authUser.id);
    }
    
    const { data: users, error } = await query.limit(10);
    
    if (error || !users) {
        console.warn("Could not fetch other users, returning placeholders.", error);
        return placeholderUsers.filter(u => u.id !== authUser?.id);
    }
    return users.map(({ full_name, ...rest }) => ({...rest, name: full_name})) as User[];
}


/**
 * Fetches agency-related metrics for the dashboard.
 * This includes total revenue, project counts, and client acquisition numbers.
 */
export async function getAgencyDashboardMetrics() {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { teamRevenue: 0, totalProjects: 0, clientAcquisition: 0 };
    
    // In a real app, you would fetch the user's agency_id
    // For now, let's assume one agency for simplicity and find it by owner_id
    const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select('id')
        .eq('owner_id', user.id)
        .single();

    if (agencyError || !agency) {
        console.log("No agency found for user, returning 0 metrics.");
        return { teamRevenue: 0, totalProjects: 0, clientAcquisition: 0 };
    }

    const { data, error } = await supabase
      .from('monthly_metrics')
      .select('revenue')
      .eq('agency_id', agency.id);

    if (error || !data) {
        console.error("Error fetching agency metrics:", error)
        return { teamRevenue: 0, totalProjects: 0, clientAcquisition: 0 };
    }
    
    const teamRevenue = data.reduce((acc, month) => acc + month.revenue, 0);

    // These would be more complex queries in a real app
    const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agency.id);
    
    const { count: clientAcquisition } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agency.id);

    return {
        teamRevenue,
        totalProjects: totalProjects || 0,
        clientAcquisition: clientAcquisition || 0,
    };
}


/**
 * Fetches the operational chart data (monthly metrics) for the agency dashboard.
 */
export async function getAgencyOperationalChartData() {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select('id')
        .eq('owner_id', user.id)
        .single();

    if (agencyError || !agency) {
        return [];
    }

    const { data, error } = await supabase
        .from('monthly_metrics')
        .select('month, revenue, expenses, new_leads, projects_won, portfolio_updates')
        .eq('agency_id', agency.id)
        .order('month', { ascending: true });

    if (error) {
        console.error("Error fetching operational chart data:", error);
        return [];
    }
    
    // Format data for the chart
    return data.map(d => ({
        month: new Date(d.month).toLocaleString('default', { month: 'short' }),
        revenue: d.revenue / 1000, // Assuming revenue is in dollars, chart expects thousands
        expenses: d.expenses / 1000,
        profit: (d.revenue - d.expenses) / 1000,
        leads: d.new_leads,
        projectsWon: d.projects_won,
        portfolioUpdates: d.portfolio_updates,
    }));
}
