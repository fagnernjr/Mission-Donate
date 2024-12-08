'use client'

import { useAuthContext } from '@/components/providers/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { type UserRole } from '@/types/database'

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated
        if (pathname !== '/login' && pathname !== '/register') {
          router.replace('/login')
        }
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // No permission for this route
        router.replace('/dashboard')
      }
    }
  }, [user, loading, router, pathname, allowedRoles])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user && pathname !== '/login' && pathname !== '/register') {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
