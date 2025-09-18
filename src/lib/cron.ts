'use server';

import { createSupabaseServerClient } from './supabase/server';

/**
 * @fileOverview A server action to manage waitlisted users.
 * This can be set up to run on a schedule (e.g., a cron job) to automate user activation.
 */

/**
 * Promotes users from the waitlist to active status if they signed up more than two days ago.
 * @returns {Promise<{success: boolean, promotedCount: number, error?: string}>} An object indicating success, the number of users promoted, and any potential error.
 */
export async function promoteWaitlistedUsers() {
    console.log('Running job to promote waitlisted users...');
    const supabase = createSupabaseServerClient();

    // 1. Calculate the cutoff date (2 days ago)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    try {
        // 2. Find users on the waitlist who joined more than 2 days ago
        // and whose profiles are not yet 'active'.
        const { data: waitlistedUsers, error: waitlistError } = await supabase
            .from('waitlist')
            .select(`
                id,
                profile:profiles!inner(status)
            `)
            .lt('created_at', twoDaysAgo.toISOString())
            .neq('profile.status', 'active');
            
        if (waitlistError) {
            console.error('Error fetching waitlisted users:', waitlistError);
            return { success: false, promotedCount: 0, error: waitlistError.message };
        }

        if (!waitlistedUsers || waitlistedUsers.length === 0) {
            console.log('No users to promote.');
            return { success: true, promotedCount: 0 };
        }

        const userIdsToPromote = waitlistedUsers.map(u => u.id);
        console.log(`Found ${userIdsToPromote.length} users to promote.`);

        // 3. Update the status of these users in the 'profiles' table
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ status: 'active' })
            .in('id', userIdsToPromote);

        if (updateError) {
            console.error('Error updating profiles to active:', updateError);
            return { success: false, promotedCount: 0, error: updateError.message };
        }

        console.log(`Successfully promoted ${userIdsToPromote.length} users.`);
        return { success: true, promotedCount: userIdsToPromote.length };

    } catch (e: any) {
        console.error('An unexpected error occurred during user promotion:', e);
        return { success: false, promotedCount: 0, error: e.message };
    }
}