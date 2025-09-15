
'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User, Post, Course, Experience } from './types';

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

// =================================================================
// User & Profile Functions
// =================================================================

/**
 * Fetches the current authenticated user's profile.
 * If no user is logged in, or no profile exists, it returns null.
 */
export async function getCurrentUser(): Promise<User | null> {
    const supabase = createSupabaseServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return null;
    }
    
    const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
    
    if (error || !userProfile) {
        console.warn("Could not fetch user profile for ID:", authUser.id, error);
        return null;
    }

    const { full_name, ...rest } = userProfile;
    // A real app would fetch portfolio items from a separate table.
    // For now, we return an empty array.
    return { ...rest, name: full_name, portfolio: [] } as User;
}

/**
 * Fetches all user profiles from the database.
 */
export async function getUsers(): Promise<User[]> {
    const supabase = createSupabaseServerClient();
    const { data: users, error } = await supabase.from('profiles').select('*');
    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }
    return users.map(({ full_name, ...rest }) => ({...rest, name: full_name, portfolio: []})) as User[];
}

/**
 * Fetches a single user profile by their ID.
 */
export async function getUserById(id: string): Promise<User | null> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error || !data) {
        console.error(`Error fetching user ${id}:`, error);
        return null;
    }
    const { full_name, ...rest } = data;
    return { ...rest, name: full_name, portfolio: [] } as User;
}

/**
 * Fetches work experiences for a given user ID.
 */
export async function getExperiencesByUserId(userId: string): Promise<Experience[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

    if (error) {
        console.error(`Error fetching experiences for user ${userId}:`, error);
        return [];
    }
    return data as Experience[];
}


// =================================================================
// Dashboard & Agency Functions
// =================================================================

/**
 * Fetches agency-related metrics for the dashboard.
 */
export async function getAgencyDashboardMetrics() {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { teamRevenue: 0, totalProjects: 0, clientAcquisition: 0 };
    
    const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select('id')
        .limit(1)
        .single();

    if (agencyError || !agency) {
        console.log("No agencies found, returning 0 metrics.");
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

    const { count: totalProjects } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id);
    const { count: clientAcquisition } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id);

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
        .limit(1)
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
    
    return data.map(d => ({
        month: new Date(d.month).toLocaleString('default', { month: 'short' }),
        revenue: d.revenue / 1000,
        expenses: d.expenses / 1000,
        profit: (d.revenue - d.expenses) / 1000,
        leads: d.new_leads,
        projectsWon: d.projects_won,
        portfolioUpdates: d.portfolio_updates,
    }));
}


export async function getAgencyMetrics() {
    const supabase = createSupabaseServerClient();
    const { data: agency } = await supabase.from('agencies').select('id').limit(1).single();
    if (!agency) return null;

    const [
        { count: activeClients, error: activeClientsError },
        { data: latestMetrics, error: latestMetricsError },
        { count: activeProjects, error: activeProjectsError }
    ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id).eq('status', 'Active'),
        supabase.from('monthly_metrics').select('*').eq('agency_id', agency.id).order('month', { ascending: false }).limit(1).single(),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('agency_id', agency.id).eq('status', 'In Progress')
    ]);

    if (activeClientsError || latestMetricsError || activeProjectsError) {
        console.error('Error fetching agency metrics:', { activeClientsError, latestMetricsError, activeProjectsError });
        return null;
    }

    if (!latestMetrics) return null;

    return {
        financials: {
            monthlyRevenue: latestMetrics.revenue,
            monthlyProfit: latestMetrics.revenue - latestMetrics.expenses,
        },
        clients: {
            activeClients: activeClients || 0,
            satisfaction: latestMetrics.client_satisfaction_score,
        },
        projects: {
            activeProjects: activeProjects || 0,
            onTimeDelivery: 98.5, 
            budgetAdherence: 95.2,
        },
        team: {
            satisfaction: latestMetrics.team_satisfaction_score,
            capacity: 85,
        }
    };
}


// =================================================================
// Feed & Posts Functions
// =================================================================

export async function getPosts(): Promise<Post[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:profiles!author_id (
                id,
                full_name,
                headline,
                avatar_url
            )
        `)
        .is('parent_id', null) // Fetch only top-level posts
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        return [];
    }

    return data.map(p => ({
        ...p,
        author: {
            ...p.author,
            name: p.author.full_name
        }
    })) as Post[];
}


// =================================================================
// Courses Functions
// =================================================================

export async function getCourses(): Promise<Course[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('courses')
        .select('*');

    if (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
    return data as Course[];
}


// =================================================================
// News Functions
// =================================================================
export async function getNews() {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('articles').select('*').order('created_at', {ascending: false});
    if (error) {
        console.error('Error fetching news:', error);
        return [];
    }
    return data.map(a => ({
        ...a,
        date: new Date(a.created_at).toLocaleDateString(),
        imageUrl: a.image_url,
    }));
}


// =================================================================
// Messages Functions
// =================================================================
export async function getConversations() {
    const supabase = createSupabaseServerClient();
    const {data: { user }} = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('conversations')
        .select(`
            *,
            participants:conversation_participants!conversation_id(
                profile:profiles!user_id(id, full_name, avatar_url, headline)
            ),
            last_message:messages!last_message_id(
                id, content, created_at
            )
        `)
        .or(`participants.user_id.eq.${user.id}`);
        
    if (error) {
        console.error('Error fetching conversations', error);
        return [];
    }

    return data.map(c => ({
        id: c.id,
        name: c.is_group ? c.name : c.participants.find((p: any) => p.profile.id !== user.id)?.profile.full_name || 'Conversation',
        avatar: c.is_group ? c.avatar_url : c.participants.find((p: any) => p.profile.id !== user.id)?.profile.avatar_url,
        lastMessage: {
            text: c.last_message?.content || 'No messages yet',
            time: c.last_message ? new Date(c.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        },
        type: c.is_group ? 'group' : 'dm',
        messages: [],
    }));
}

// =================================================================
// Personal Dashboard Chart Functions
// =================================================================

export async function getPersonalProductivityChartData(timeline: 'daily' | 'weekly' | 'monthly') {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    if (timeline === 'monthly') {
        const { data, error } = await supabase
            .from('user_monthly_metrics')
            .select('*')
            .eq('user_id', user.id)
            .order('month', { ascending: true });
        
        if (error) {
            console.error("Error fetching monthly user metrics:", error);
            return [];
        }
        
        return data.map(d => ({
            month: new Date(d.month).toLocaleString('default', { month: 'short' }),
            revenue: d.total_revenue / 1000,
            projects: d.total_projects,
            impressions: d.total_impressions,
            acquisition: d.new_clients,
            revPerProject: d.avg_rev_per_project / 1000
        }));
    }

    // For daily and weekly, we'll fetch daily and aggregate
    const { data, error } = await supabase
        .from('user_daily_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(timeline === 'daily' ? 7 : 30); // 7 days for daily, 4 weeks of data for weekly

    if (error) {
        console.error("Error fetching daily user metrics:", error);
        return [];
    }

    if (timeline === 'daily') {
        return data.reverse().map(d => ({
            day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
            revenue: d.revenue_generated / 1000,
            projects: d.projects_completed,
            impressions: d.search_appearances + d.profile_views,
            acquisition: d.connections_made,
            revPerProject: d.projects_completed > 0 ? (d.revenue_generated / d.projects_completed) / 1000 : 0
        }));
    }

    if (timeline === 'weekly') {
        const weeks: any = {};
        data.forEach(d => {
            const date = new Date(d.date);
            const weekStart = new Date(date.setDate(date.getDate() - date.getDay())).toISOString().split('T')[0];
            if (!weeks[weekStart]) {
                weeks[weekStart] = { revenue: 0, projects: 0, impressions: 0, acquisition: 0, count: 0, revPerProject: 0 };
            }
            weeks[weekStart].revenue += d.revenue_generated;
            weeks[weekStart].projects += d.projects_completed;
            weeks[weekStart].impressions += d.search_appearances + d.profile_views;
            weeks[weekStart].acquisition += d.connections_made;
            weeks[weekStart].count++;
        });

        return Object.keys(weeks).map(weekStart => ({
            week: `Week of ${new Date(weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
            ...weeks[weekStart],
            revenue: (weeks[weekStart].revenue / 1000),
            revPerProject: weeks[weekStart].projects > 0 ? (weeks[weekStart].revenue / weeks[weekStart].projects) / 1000 : 0
        })).slice(-4); // Return last 4 weeks
    }
    
    return [];
}


export async function getProfileEngagementChartData(timeline: 'daily' | 'weekly' | 'monthly') {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('user_daily_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(timeline === 'daily' ? 7 : (timeline === 'weekly' ? 28 : 90)); // Fetch more for aggregation

    if (error) {
        console.error("Error fetching engagement data:", error);
        return [];
    }
    
    data.reverse(); // oldest to newest

    if (timeline === 'daily') {
        return data.slice(-7).map(d => ({
            day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
            views: d.profile_views,
            connections: d.connections_made,
            searches: d.search_appearances,
            likes: d.post_likes,
            skillSyncNetMatches: d.skill_sync_matches,
        }));
    }
    
    if (timeline === 'weekly') {
        const weeks: any = {};
        data.forEach(d => {
            const date = new Date(d.date);
            const weekStart = new Date(date.setDate(date.getDate() - date.getDay() + 1)).toISOString().split('T')[0]; // Start week on Monday
            if (!weeks[weekStart]) {
                weeks[weekStart] = { views: 0, connections: 0, searches: 0, likes: 0, skillSyncNetMatches: 0 };
            }
            weeks[weekStart].views += d.profile_views;
            weeks[weekStart].connections += d.connections_made;
            weeks[weekStart].searches += d.search_appearances;
            weeks[weekStart].likes += d.post_likes;
            weeks[weekStart].skillSyncNetMatches += d.skill_sync_matches;
        });

        return Object.keys(weeks).map(weekStart => ({
            week: `W/C ${new Date(weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
            ...weeks[weekStart],
        })).slice(-4);
    }
    
    if (timeline === 'monthly') {
        const months: any = {};
        data.forEach(d => {
            const monthStart = new Date(d.date).toISOString().substring(0, 7) + '-01';
            if (!months[monthStart]) {
                months[monthStart] = { views: 0, connections: 0, searches: 0, likes: 0, skillSyncNetMatches: 0 };
            }
            months[monthStart].views += d.profile_views;
            months[monthStart].connections += d.connections_made;
            months[monthStart].searches += d.search_appearances;
            months[monthStart].likes += d.post_likes;
            months[monthStart].skillSyncNetMatches += d.skill_sync_matches;
        });
        
        return Object.keys(months).map(monthStart => ({
            month: new Date(monthStart).toLocaleString('default', { month: 'short' }),
             ...months[monthStart],
        })).slice(-12);
    }

    return [];
}

// =================================================================
// Ad Studio Functions
// =================================================================

export async function getCampaigns() {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error("Error fetching campaigns:", error);
        return [];
    }
    return data;
}

export async function createCampaign(campaignData: { name: string, type: string, content: string, keywords: string }) {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in to create a campaign." };

    const { error } = await supabase.from('campaigns').insert({
        name: campaignData.name,
        type: campaignData.type,
        status: 'Active',
        spend: 0,
        conversions: 0,
        user_id: user.id
    });
    
    if (error) {
        console.error("Error creating campaign:", error);
        return { error: "Failed to create campaign in the database." };
    }

    return { success: true };
}

// =================================================================
// Billing Functions
// =================================================================

export async function getBillingInfo() {
     const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // These are just placeholders. A real app would have complex logic here.
    const invoices = [
        { id: "INV-2024-001", date: "July 1, 2024", amount: "$99.00", status: "Paid" },
        { id: "INV-2024-002", date: "June 1, 2024", amount: "$99.00", status: "Paid" },
    ];

    const paymentMethods = [
        { type: 'visa', details: 'Visa ending in 1234', expiry: '08/2026', isDefault: true },
    ];
    
    return { invoices, paymentMethods };
}


// =================================================================
// Workspace / Solo Session Functions
// =================================================================

export async function saveSoloSession(durationSeconds: number) {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated." };

    // This is a simplified implementation. A real app would likely have more robust logic
    // to handle daily roll-ups, but for now we'll just increment a field.
    // We'll simulate adding to a 'solo_session_logs' table.
    console.log(`Saving solo session of ${durationSeconds} seconds for user ${user.id}`);
    
    // In a real implementation, you would likely do something like this:
    /*
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.rpc('increment_solo_session', {
        user_id_in: user.id,
        date_in: today,
        duration_in: durationSeconds
    });
    
    if (error) {
        console.error("Error saving solo session:", error);
        return { error: "Database operation failed." };
    }
    */

    return { success: true };
}
