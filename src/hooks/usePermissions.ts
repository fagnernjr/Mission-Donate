import { useSession } from '@/hooks/useSession'
import { UserRole } from '@/lib/auth/policies'

interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
}

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    // Acesso total a todos os recursos
    { resource: 'campaigns', action: 'create' },
    { resource: 'campaigns', action: 'read' },
    { resource: 'campaigns', action: 'update' },
    { resource: 'campaigns', action: 'delete' },
    { resource: 'donations', action: 'create' },
    { resource: 'donations', action: 'read' },
    { resource: 'donations', action: 'update' },
    { resource: 'donations', action: 'delete' },
    { resource: 'organizations', action: 'create' },
    { resource: 'organizations', action: 'read' },
    { resource: 'organizations', action: 'update' },
    { resource: 'organizations', action: 'delete' },
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'audit_logs', action: 'read' },
  ],
  user: [
    // Acesso às próprias campanhas e organizações
    { resource: 'campaigns', action: 'create' },
    { resource: 'campaigns', action: 'read' },
    { resource: 'campaigns', action: 'update' },
    { resource: 'campaigns', action: 'delete' },
    { resource: 'donations', action: 'read' },
    { resource: 'organizations', action: 'create' },
    { resource: 'organizations', action: 'read' },
    { resource: 'organizations', action: 'update' },
  ],
  donor: [
    // Acesso às doações e visualização de campanhas
    { resource: 'campaigns', action: 'read' },
    { resource: 'donations', action: 'create' },
    { resource: 'donations', action: 'read' },
    { resource: 'donations', action: 'update' },
    { resource: 'organizations', action: 'read' },
  ],
}

export function usePermissions() {
  const { session } = useSession()
  const userRole = session?.user?.user_metadata?.role as UserRole | undefined

  const can = (resource: string, action: Permission['action']): boolean => {
    if (!userRole) return false

    return rolePermissions[userRole].some(
      permission =>
        permission.resource === resource && permission.action === action
    )
  }

  const canAccessRoute = (route: string): boolean => {
    if (!userRole) return false

    // Rotas públicas
    const publicRoutes = ['/login', '/register', '/reset-password']
    if (publicRoutes.includes(route)) return true

    // Mapeamento de rotas para permissões
    const routePermissions: Record<string, Permission> = {
      '/dashboard': { resource: 'campaigns', action: 'read' },
      '/campaigns/new': { resource: 'campaigns', action: 'create' },
      '/campaigns/[id]/edit': { resource: 'campaigns', action: 'update' },
      '/donations': { resource: 'donations', action: 'read' },
      '/donations/new': { resource: 'donations', action: 'create' },
      '/organizations': { resource: 'organizations', action: 'read' },
      '/organizations/new': { resource: 'organizations', action: 'create' },
      '/admin': { resource: 'users', action: 'read' },
    }

    const permission = routePermissions[route]
    if (!permission) return true // Rotas sem restrição específica

    return can(permission.resource, permission.action)
  }

  const isAdmin = userRole === 'admin'
  const isUser = userRole === 'user'
  const isDonor = userRole === 'donor'

  return {
    can,
    canAccessRoute,
    isAdmin,
    isUser,
    isDonor,
    userRole,
  }
}

// Hook para verificar propriedade de recursos
export function useResourceOwnership() {
  const { session } = useSession()
  const userId = session?.user?.id

  const isOwner = async (resource: string, resourceId: string): Promise<boolean> => {
    if (!userId) return false

    try {
      const response = await fetch(
        `/api/check-ownership?resource=${resource}&id=${resourceId}`
      )
      const data = await response.json()
      return data.isOwner
    } catch (error) {
      console.error('Error checking resource ownership:', error)
      return false
    }
  }

  return { isOwner }
}
