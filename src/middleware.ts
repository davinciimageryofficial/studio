import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const publicUrls = ['/login', '/signup', '/auth/callback', '/', '/waitlist-confirmation', '/logout', '/faq', '/donate'];
  const isPublicUrl = publicUrls.includes(request.nextUrl.pathname);

  // if the user is not logged in and not trying to access a public url,
  // redirect them to the login page
  if (!user && !isPublicUrl) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // if the user is logged in and tries to access login/signup, redirect to dashboard
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
