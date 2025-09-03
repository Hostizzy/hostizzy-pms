import { createRouteHandlerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo')

  if (code) {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(new URL('/auth/login?error=auth_failed', requestUrl.origin))
      }

      if (data.session) {
        // Get or create user profile
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single()

        if (!existingProfile) {
          // Create profile for new user
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.session.user.id,
              email: data.session.user.email!,
              name: data.session.user.email!.split('@')[0], // Default name from email
              role: 'guest' // Default role
            })

          if (profileError) {
            console.error('Profile creation error:', profileError)
          }
        }

        // Redirect to intended page or dashboard
        const redirectUrl = redirectTo || '/dashboard'
        return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin))
      }
    } catch (error) {
      console.error('Unexpected auth error:', error)
      return NextResponse.redirect(new URL('/auth/login?error=unexpected', requestUrl.origin))
    }
  }

  // If no code or auth failed, redirect to login
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}
