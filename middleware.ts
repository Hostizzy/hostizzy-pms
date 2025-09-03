import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createMiddlewareClient(request)

    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession()

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
    const isPublicPage = request.nextUrl.pathname.startsWith('/guest') || 
                        request.nextUrl.pathname.startsWith('/api/guest')
    const isApiRoute = request.nextUrl.pathname.startsWith('/api')

    // Allow public guest routes (KYC, reviews) without authentication
    if (isPublicPage) {
      return response
    }

    // If no session and trying to access protected route, redirect to login
    if (!session && !isAuthPage) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If session exists and trying to access auth pages, redirect to dashboard
    if (session && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // For authenticated requests, add user profile to headers for role-based access
    if (session && !isApiRoute) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, name, email')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          // Add user role to request headers for easy access in components
          const requestHeaders = new Headers(request.headers)
          requestHeaders.set('x-user-role', profile.role)
          requestHeaders.set('x-user-id', session.user.id)
          requestHeaders.set('x-user-email', profile.email)

          // Check role-based access for specific routes
          const pathname = request.nextUrl.pathname

          // Admin-only routes
          if (pathname.startsWith('/admin') && profile.role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
          }

          // Owner-only routes
          if (pathname.startsWith('/owner') && !['admin', 'owner'].includes(profile.role)) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
          }

          // Manager routes (admin, manager can access)
          if (pathname.startsWith('/manager') && !['admin', 'manager'].includes(profile.role)) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
          }

          // Import routes (admin, manager only)
          if (pathname.startsWith('/import') && !['admin', 'manager'].includes(profile.role)) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
          }

          return NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
        }
      } catch (error) {
        console.error('Error fetching user profile in middleware:', error)
      }
    }

    return response
  } catch (e) {
    // If there's an error, return the response as-is
    console.error('Middleware error:', e)
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
