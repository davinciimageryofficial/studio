

'use server';

import { createSupabaseServerClient } from './supabase/server';
import type { User, Post, Course, Experience, Task, TaskStatus } from './types';

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

    const { full_name, avatar_url, job_title, ...rest } = userProfile;
    
    const { data: portfolioItems } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', authUser.id);

    return { 
        ...rest, 
        name: full_name, 
        avatar: avatar_url, 
        jobTitle: job_title,
        portfolio: portfolioItems || []
    } as User;
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
    return users.map(({ full_name, avatar_url, job_title, ...rest }) => ({
        ...rest, 
        name: full_name, 
        avatar: avatar_url, 
        jobTitle: job_title, 
        portfolio: [] // Portfolio items are not needed for list views
    })) as User[];
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
    const { full_name, avatar_url, job_title, ...rest } = data;
    
    const { data: portfolioItems } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', id);

    return { 
        ...rest, 
        name: full_name, 
        avatar: avatar_url, 
        jobTitle: job_title,
        portfolio: portfolioItems || []
    } as User;
}

/**
 * Fetches all experiences for a given user ID.
 */
export async function getExperiencesByUserId(userId: string): Promise<Experience[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('experiences').select('*').eq('user_id', userId);
    if (error) {
        console.error("Error fetching experiences:", error);
        return [];
    }
    return data;
}

/**
 * Fetches all data needed for the profile page.
 */
export async function getProfilePageData(userId: string) {
    const supabase = createSupabaseServerClient();
    
    let profileId = userId;
    let isMe = false;

    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (userId === 'me' && authUser) {
        profileId = authUser.id;
        isMe = true;
    } else if (authUser && userId === authUser.id) {
        isMe = true;
    }

    const user = await getUserById(profileId);
    const experiences = await getExperiencesByUserId(profileId);
    
    return { user, experiences, currentUser: isMe ? user : await getCurrentUser() };
}


/**
 * Fetches all posts and their authors for the feed.
 */
export async function getPosts(): Promise<Post[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:profiles!author_id(*),
            replies:posts!parent_id(
                *,
                author:profiles!author_id(*)
            )
        `)
        .is('parent_id', null) // Fetch only top-level posts
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
    
    return data.map(post => ({
        ...post,
        author: {
            ...post.author,
            name: post.author.full_name,
            avatar: post.author.avatar_url,
            jobTitle: post.author.job_title,
        },
        replies: post.replies.map((reply: any) => ({
            ...reply,
            author: {
                ...reply.author,
                name: reply.author.full_name,
                avatar: reply.author.avatar_url,
                jobTitle: reply.author.job_title,
            }
        }))
    })) as Post[];
}

/**
 * Fetches all courses from the database.
 */
export async function getCourses(): Promise<Course[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('courses').select('*');
  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
  return data as Course[];
}


/**
 * Fetches all campaigns.
 */
export async function getCampaigns() {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('campaigns').select('*');
    if (error) return [];
    return data;
}

/**
 * Creates a new campaign.
 */
export async function createCampaignInDb(campaign: { name: string, type: string, content: string, keywords: string }) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('campaigns').insert({
        name: campaign.name,
        type: campaign.type,
        status: 'Active',
        spend: Math.floor(Math.random() * 500) + 50, // Mock spend
        conversions: Math.floor(Math.random() * 50) + 5, // Mock conversions
    }).select().single();
    
    if (error) {
        return { error: error.message };
    }
    return { data };
}


/**
 * Fetches all data for the dashboard page.
 */
export async function getDashboardPageData(currentUser: User) {
    const supabase = createSupabaseServerClient();
    
    const [
        users,
        tasks
    ] = await Promise.all([
        getUsers(),
        getTasks()
    ]);

    const dashboardMetrics = {
        teamRevenue: 245000,
        totalProjects: 78,
        clientAcquisition: 12
    };

    const personalMetrics = {
        profileViews: 12450,
        newConnections: 82,
        pendingInvitations: 3,
        profileViewsChange: 15.2,
        newConnectionsChange: 5.8
    };
    
    const agencyMetrics = {
        financials: { monthlyRevenue: 85000, monthlyProfit: 22000 },
        clients: { activeClients: 15, satisfaction: 4.8 },
        projects: { activeProjects: 22, onTimeDelivery: 92, budgetAdherence: 98 },
        team: { satisfaction: 4.5, capacity: 85 },
    };

    return {
        otherUsers: users.filter(u => u.id !== currentUser?.id),
        dashboardMetrics,
        personalMetrics,
        agencyMetrics,
        initialTasks: tasks,
    };
}


export async function getTasks() {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { todo: [], inProgress: [], done: [] };

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error("Error fetching tasks:", error);
        return { todo: [], inProgress: [], done: [] };
    }

    const tasks: { [key in TaskStatus]: Task[] } = {
        todo: [],
        inProgress: [],
        done: [],
    };
    
    data.forEach(task => {
        tasks[task.status as TaskStatus].push(task as Task);
    });

    return tasks;
}

export async function createTask(task: Omit<Task, 'id' | 'created_at'>) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('tasks').insert(task).select().single();
    if (error) return { error: error.message };
    return { data: data as Task };
}

export async function updateTask(id: number, updates: Partial<Task>) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
    if (error) return { error: error.message };
    return { data: data as Task };
}

export async function deleteTask(id: number) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) return { error: error.message };
    return { success: true };
}


export async function getPersonalProductivityChartData(timeline: 'daily' | 'weekly' | 'monthly') {
    // In a real app, you would fetch and aggregate this from a database.
    // For now, we'll return mock data based on the timeline.
    if (timeline === 'daily') {
        return [
            { day: 'Mon', revenue: 1.2, projects: 1, impressions: 520, acquisition: 0, revPerProject: 1.2 },
            { day: 'Tue', revenue: 1.8, projects: 2, impressions: 780, acquisition: 1, revPerProject: 0.9 },
            { day: 'Wed', revenue: 0.8, projects: 1, impressions: 450, acquisition: 0, revPerProject: 0.8 },
            { day: 'Thu', revenue: 2.5, projects: 1, impressions: 980, acquisition: 1, revPerProject: 2.5 },
            { day: 'Fri', revenue: 3.1, projects: 2, impressions: 1230, acquisition: 0, revPerProject: 1.55 },
        ];
    }
    if (timeline === 'weekly') {
        return [
            { week: 'W1', revenue: 8.5, projects: 5, impressions: 4500, acquisition: 2, revPerProject: 1.7 },
            { week: 'W2', revenue: 9.2, projects: 6, impressions: 5200, acquisition: 3, revPerProject: 1.53 },
            { week: 'W3', revenue: 7.8, projects: 4, impressions: 4100, acquisition: 1, revPerProject: 1.95 },
            { week: 'W4', revenue: 10.1, projects: 7, impressions: 6200, acquisition: 4, revPerProject: 1.44 },
        ];
    }
    // monthly
    return [
        { month: 'Jan', revenue: 35, projects: 20, impressions: 18000, acquisition: 8, revPerProject: 1.75 },
        { month: 'Feb', revenue: 42, projects: 25, impressions: 22000, acquisition: 12, revPerProject: 1.68 },
        { month: 'Mar', revenue: 38, projects: 22, impressions: 20000, acquisition: 9, revPerProject: 1.72 },
        { month: 'Apr', revenue: 45, projects: 28, impressions: 25000, acquisition: 15, revPerProject: 1.60 },
        { month: 'May', revenue: 52, projects: 30, impressions: 28000, acquisition: 18, revPerProject: 1.73 },
        { month: 'Jun', revenue: 48, projects: 26, impressions: 26000, acquisition: 14, revPerProject: 1.84 },
    ];
}


export async function getProfileEngagementChartData(timeline: 'daily' | 'weekly' | 'monthly') {
     if (timeline === 'daily') {
        return [
            { day: 'Mon', views: 150, connections: 5, searches: 30, likes: 25, skillSyncNetMatches: 2 },
            { day: 'Tue', views: 180, connections: 7, searches: 45, likes: 40, skillSyncNetMatches: 3 },
            { day: 'Wed', views: 120, connections: 3, searches: 25, likes: 18, skillSyncNetMatches: 1 },
            { day: 'Thu', views: 250, connections: 10, searches: 60, likes: 55, skillSyncNetMatches: 5 },
            { day: 'Fri', views: 280, connections: 12, searches: 70, likes: 60, skillSyncNetMatches: 6 },
        ];
    }
    if (timeline === 'weekly') {
        return [
            { week: 'W1', views: 1200, connections: 40, searches: 250, likes: 180, skillSyncNetMatches: 15 },
            { week: 'W2', views: 1500, connections: 55, searches: 320, likes: 250, skillSyncNetMatches: 20 },
            { week: 'W3', views: 1100, connections: 35, searches: 220, likes: 160, skillSyncNetMatches: 12 },
            { week: 'W4', views: 1800, connections: 70, searches: 400, likes: 300, skillSyncNetMatches: 25 },
        ];
    }
    // monthly
    return [
        { month: 'Jan', views: 5000, connections: 150, searches: 1000, likes: 800, skillSyncNetMatches: 50 },
        { month: 'Feb', views: 6200, connections: 180, searches: 1200, likes: 1100, skillSyncNetMatches: 65 },
        { month: 'Mar', views: 5500, connections: 160, searches: 1100, likes: 950, skillSyncNetMatches: 58 },
        { month: 'Apr', views: 7000, connections: 220, searches: 1500, likes: 1400, skillSyncNetMatches: 80 },
        { month: 'May', views: 8200, connections: 250, searches: 1800, likes: 1800, skillSyncNetMatches: 95 },
        { month: 'Jun', views: 7500, connections: 230, searches: 1600, likes: 1600, skillSyncNetMatches: 88 },
    ];
}

export async function getAgencyOperationalChartData() {
    return [
        { month: 'Jan', revenue: 50, expenses: 30, profit: 20, leads: 40, projectsWon: 15, portfolioUpdates: 10 },
        { month: 'Feb', revenue: 55, expenses: 32, profit: 23, leads: 45, projectsWon: 18, portfolioUpdates: 12 },
        { month: 'Mar', revenue: 62, expenses: 35, profit: 27, leads: 50, projectsWon: 22, portfolioUpdates: 15 },
        { month: 'Apr', revenue: 70, expenses: 40, profit: 30, leads: 55, projectsWon: 25, portfolioUpdates: 18 },
        { month: 'May', revenue: 85, expenses: 45, profit: 40, leads: 60, projectsWon: 28, portfolioUpdates: 22 },
        { month: 'Jun', revenue: 90, expenses: 50, profit: 40, leads: 65, projectsWon: 30, portfolioUpdates: 25 },
    ]
}


export async function getNews() {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('news').select('*');
    if (error) {
        console.error("Error fetching news:", error);
        return [];
    }
    return data;
}

export async function getBillingInfo() {
     const supabase = createSupabaseServerClient();
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) return null;

    // In a real app, this data would come from your database
    const invoices = [
        { id: "INV-2024-001", date: "July 1, 2024", amount: "$99.00" },
        { id: "INV-2024-002", date: "June 1, 2024", amount: "$99.00" },
        { id: "INV-2024-003", date: "May 1, 2024", amount: "$99.00" },
    ];

    const paymentMethods = [
        { type: "visa", details: "Visa ending in 4242", expiry: "08/26", isDefault: true },
        { type: "paypal", details: user.email, isDefault: false },
    ];

    return { invoices, paymentMethods };
}

export async function getConversations() {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('conversations')
        .select(`
            *,
            messages:messages!conversation_id(
                *,
                sender:profiles!sender_id(*)
            ),
            participants:conversation_participants!conversation_id(
                profile:profiles!user_id(*)
            )
        `)
        .eq('participants.user_id', user.id);
        
    if (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }

    const formattedConversations = data.map(convo => {
        const otherParticipant = convo.participants.find(p => p.profile.id !== user.id)?.profile;
        const lastMessage = convo.messages[convo.messages.length - 1];

        return {
            id: convo.id,
            name: convo.is_group ? convo.name : otherParticipant?.full_name || 'Unknown User',
            avatar: convo.is_group ? convo.avatar_url : otherParticipant?.avatar_url,
            lastMessage: {
                from: lastMessage.sender.id === user.id ? 'me' : 'other',
                fromName: lastMessage.sender.full_name,
                text: lastMessage.content,
                time: new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            messages: convo.messages.map((msg: any) => ({
                from: msg.sender.id === user.id ? 'me' : 'other',
                fromName: msg.sender.full_name,
                text: msg.content,
                time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            })),
            type: convo.is_group ? (convo.is_agency ? 'agency' : 'group') : 'dm',
        };
    });
    
    // Sort by most recent message
    formattedConversations.sort((a, b) => {
        const timeA = new Date(b.messages[b.messages.length - 1]?.time || 0).getTime();
        const timeB = new Date(a.messages[a.messages.length - 1]?.time || 0).getTime();
        return timeA - timeB;
    });

    return formattedConversations;
}


export async function saveSoloSession(durationInSeconds: number) {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated" };

    const { error } = await supabase
        .from('focus_sessions')
        .insert({ user_id: user.id, duration_seconds: durationInSeconds });
        
    if (error) {
        console.error("Error saving solo session:", error);
        return { error: error.message };
    }
    return { success: true };
}


export async function updateUserProfile(userId: string, updates: { name?: string; headline?: string; bio?: string; }) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: updates.name,
            headline: updates.headline,
            bio: updates.bio,
        })
        .eq('id', userId);

    if (error) {
        return { error: error.message };
    }
    return { success: true };
}
