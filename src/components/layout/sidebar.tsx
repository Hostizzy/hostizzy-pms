'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserRole } from '@/types/database'
import {
  Building2,
  Calendar,
  Users,
  Home,
  UtensilsCrossed,
  BarChart3,
  Upload,
  Settings,
  Star,
  Shield,
  UserCheck
} from 'lucide-react'

interface SidebarProps {
  userRole: UserRole
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['admin', 'owner', 'manager', 'guest']
  },
  {
    name: 'Properties',
    href: '/properties',
    icon: Building2,
    roles: ['admin', 'owner', 'manager']
  },
  {
    name: 'Reservations',
    href: '/reservations',
    icon: Calendar,
    roles: ['admin', 'owner', 'manager']
  },
  {
    name: 'Guests',
    href: '/guests',
    icon: Users,
    roles: ['admin', 'manager']
  },
  {
    name: 'Menus',
    href: '/menus',
    icon: UtensilsCrossed,
    roles: ['admin', 'manager']
  },
  {
    name: 'Reviews',
    href: '/reviews',
    icon: Star,
    roles: ['admin', 'owner', 'manager']
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['admin', 'owner']
  },
  {
    name: 'Import Data',
    href: '/import',
    icon: Upload,
    roles: ['admin', 'manager']
  },
  {
    name: 'Admin Panel',
    href: '/admin',
    icon: Shield,
    roles: ['admin']
  },
  {
    name: 'Owner Portal',
    href: '/owner',
    icon: UserCheck,
    roles: ['owner']
  }
]

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  )

  return (
    <div className="bg-white w-64 shadow-sm border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Hostizzy</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Role Badge */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {userRole} Account
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
