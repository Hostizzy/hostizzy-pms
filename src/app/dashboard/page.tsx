import { Suspense } from 'react'
import { createServerComponentClient, getUserProfile, getUserAccessibleProperties } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentReservations } from '@/components/dashboard/recent-reservations'
import { UpcomingCheckIns } from '@/components/dashboard/upcoming-checkins'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { CalendarIcon, Users, Building2, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function Dashboard() {
  const profile = await getUserProfile()
  const properties = await getUserAccessibleProperties()
  const supabase = createServerComponentClient()

  // Get dashboard statistics
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const propertyIds = properties.map(p => p.id)

  // Fetch key metrics based on user role and accessible properties
  let statsQuery = supabase
    .from('analytics_daily')
    .select('*')
    .gte('dt', thirtyDaysAgo)
    .lte('dt', today)

  if (propertyIds.length > 0) {
    statsQuery = statsQuery.in('property_id', propertyIds)
  }

  const { data: analyticsData } = await statsQuery

  // Calculate aggregated metrics
  const totalRevenue = analyticsData?.reduce((sum, day) => sum + (day.revenue || 0), 0) || 0
  const totalReservations = analyticsData?.reduce((sum, day) => sum + (day.reservations || 0), 0) || 0
  const totalRoomNights = analyticsData?.reduce((sum, day) => sum + (day.room_nights || 0), 0) || 0
  const avgOccupancy = analyticsData?.length ? 
    analyticsData.reduce((sum, day) => sum + (day.occupancy || 0), 0) / analyticsData.length : 0

  // Fetch recent reservations
  let reservationsQuery = supabase
    .from('reservations')
    .select(`
      *,
      properties(name, code),
      guests(name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  if (propertyIds.length > 0) {
    reservationsQuery = reservationsQuery.in('property_id', propertyIds)
  }

  const { data: recentReservations } = await reservationsQuery

  // Fetch upcoming check-ins
  let checkInsQuery = supabase
    .from('reservations')
    .select(`
      *,
      properties(name, code),
      guests(name, email, phone)
    `)
    .gte('check_in', today)
    .lte('check_in', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .eq('status', 'confirmed')
    .order('check_in', { ascending: true })
    .limit(5)

  if (propertyIds.length > 0) {
    checkInsQuery = checkInsQuery.in('property_id', propertyIds)
  }

  const { data: upcomingCheckIns } = await checkInsQuery

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservations</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservations}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Nights</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoomNights}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOccupancy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSpinner />}>
              <RevenueChart data={analyticsData || []} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations?.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{reservation.guests?.name}</p>
                    <p className="text-sm text-gray-600">{reservation.properties?.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}>
                      {reservation.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      {formatCurrency(reservation.total_amount)}
                    </p>
                  </div>
                </div>
              ))}
              {(!recentReservations || recentReservations.length === 0) && (
                <p className="text-center text-gray-500 py-4">No recent reservations</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingCheckIns?.map((checkin) => (
                <div key={checkin.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{checkin.guests?.name}</p>
                    <p className="text-sm text-gray-600">{checkin.properties?.name}</p>
                    <p className="text-xs text-gray-500">{checkin.guests?.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatDate(checkin.check_in)}</p>
                    <p className="text-xs text-gray-500">
                      {checkin.total_guests} guest{checkin.total_guests !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
              {(!upcomingCheckIns || upcomingCheckIns.length === 0) && (
                <p className="text-center text-gray-500 py-4">No upcoming check-ins</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Overview */}
      {properties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{property.name}</h3>
                      <p className="text-sm text-gray-600">{property.code}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {property.city}, {property.state}
                      </p>
                    </div>
                    <Badge variant={property.active ? 'default' : 'secondary'}>
                      {property.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span>{property.max_guests} guests max</span>
                    <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Loading Spinner Component
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
}
