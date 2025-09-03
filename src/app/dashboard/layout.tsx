import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession, getUserProfile } from '@/lib/supabase'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/auth/login')
  }

  const profile = await getUserProfile()
  
  if (!profile) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar userRole={profile.role} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={profile} />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              <Suspense fallback={<LoadingSpinner />}>
                {children}
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
