import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client
export const createClientComponentClient = () =>
  createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client for Server Components
export const createServerComponentClient = () => {
  const cookieStore = cookies()

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Server-side Supabase client for Server Actions
export const createServerActionClient = () => {
  const cookieStore = cookies()

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Server-side Supabase client for Route Handlers
export const createRouteHandlerClient = (
  request: NextRequest,
  response: NextResponse
) => {
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// Service role client for admin operations
export const createServiceRoleClient = () => {
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Middleware client
export const createMiddlewareClient = (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  return { supabase, response }
}

// Helper function to get user session server-side
export const getServerSession = async () => {
  const supabase = createServerComponentClient()
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Helper function to get user profile
export const getUserProfile = async (userId?: string) => {
  const supabase = createServerComponentClient()
  
  try {
    let targetUserId = userId
    if (!targetUserId) {
      const session = await getServerSession()
      if (!session?.user?.id) return null
      targetUserId = session.user.id
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

// Helper function to check if user has admin role
export const isAdmin = async () => {
  const profile = await getUserProfile()
  return profile?.role === 'admin'
}

// Helper function to check if user has manager role
export const isManager = async () => {
  const profile = await getUserProfile()
  return profile?.role === 'manager'
}

// Helper function to check if user is owner
export const isOwner = async () => {
  const profile = await getUserProfile()
  return profile?.role === 'owner'
}

// Helper to get properties user can access
export const getUserAccessibleProperties = async () => {
  const supabase = createServerComponentClient()
  const profile = await getUserProfile()
  
  if (!profile) return []

  try {
    if (profile.role === 'admin') {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('active', true)
        .order('name')

      if (error) throw error
      return data || []
    }

    if (profile.role === 'owner') {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_owners!inner(
            owner_id,
            owners!inner(user_id)
          )
        `)
        .eq('property_owners.owners.user_id', profile.id)
        .eq('active', true)
        .order('name')

      if (error) throw error
      return data || []
    }

    if (profile.role === 'manager') {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          managers_properties!inner(manager_id)
        `)
        .eq('managers_properties.manager_id', profile.id)
        .eq('active', true)
        .order('name')

      if (error) throw error
      return data || []
    }

    return []
  } catch (error) {
    console.error('Error getting accessible properties:', error)
    return []
  }
}
