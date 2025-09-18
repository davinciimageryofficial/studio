import { promoteWaitlistedUsers } from '@/lib/cron';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Secure the endpoint by checking for Vercel's cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  try {
    const result = await promoteWaitlistedUsers();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
