import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createAuditLog } from '@/lib/audit'

export type UserRole = 'admin' | 'missionary' | 'donor'

interface AccessPolicy {
  roles: UserRole[]
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
}

// Definição das políticas de acesso
const accessPolicies: AccessPolicy[] = [
  // Políticas para campanhas
  {
    roles: ['missionary'],
    resource: 'campaigns',
    action: 'create',
  },
  {
    roles: ['missionary'],
    resource: 'campaigns',
    action: 'update',
  },
  {
    roles: ['missionary'],
    resource: 'campaigns',
    action: 'delete',
  },
  {
    roles: ['admin', 'missionary', 'donor'],
    resource: 'campaigns',
    action: 'read',
  },

  // Políticas para doações
  {
    roles: ['donor'],
    resource: 'donations',
    action: 'create',
  },
  {
    roles: ['donor'],
    resource: 'donations',
    action: 'update',
  },
  {
    roles: ['admin', 'missionary', 'donor'],
    resource: 'donations',
    action: 'read',
  },

  // Políticas para organizações
  {
    roles: ['missionary'],
    resource: 'organizations',
    action: 'create',
  },
  {
    roles: ['missionary'],
    resource: 'organizations',
    action: 'update',
  },
  {
    roles: ['admin'],
    resource: 'organizations',
    action: 'delete',
  },
  {
    roles: ['admin', 'missionary', 'donor'],
    resource: 'organizations',
    action: 'read',
  },

  // Políticas para perfis
  {
    roles: ['admin', 'missionary', 'donor'],
    resource: 'profiles',
    action: 'read',
  },
  {
    roles: ['admin', 'missionary', 'donor'],
    resource: 'profiles',
    action: 'update',
  },

  // Políticas para administração
  {
    roles: ['admin'],
    resource: 'users',
    action: 'read',
  },
  {
    roles: ['admin'],
    resource: 'users',
    action: 'update',
  },
  {
    roles: ['admin'],
    resource: 'audit_logs',
    action: 'read',
  },
]

// Função para verificar acesso
export async function checkAccess(
  req: NextRequest,
  resource: string,
  action: AccessPolicy['action']
): Promise<boolean> {
  try {
    const supabase = createMiddlewareClient({ req, res: NextResponse.next() })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return false
    }

    const userRole = session.user.user_metadata.role as UserRole

    // Verifica se existe uma política que permite o acesso
    const hasAccess = accessPolicies.some(
      policy =>
        policy.resource === resource &&
        policy.action === action &&
        policy.roles.includes(userRole)
    )

    // Log de tentativa de acesso não autorizado
    if (!hasAccess) {
      await createAuditLog('ACCESS_DENIED', resource.toUpperCase(), {
        user_id: session.user.id,
        details: {
          action,
          resource,
          role: userRole,
          path: req.nextUrl.pathname,
        },
        level: 'warning',
        ip_address: req.ip,
        user_agent: req.headers.get('user-agent'),
      })
    }

    return hasAccess
  } catch (error) {
    console.error('Error checking access:', error)
    return false
  }
}

// Middleware para verificar acesso
export function requireAccess(resource: string, action: AccessPolicy['action']) {
  return async function(req: NextRequest) {
    const hasAccess = await checkAccess(req, resource, action)

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.next()
  }
}

// Função para verificar propriedade do recurso
export async function checkResourceOwnership(
  req: NextRequest,
  resource: string,
  resourceId: string
): Promise<boolean> {
  try {
    const supabase = createMiddlewareClient({ req, res: NextResponse.next() })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return false
    }

    const userId = session.user.id

    // Verifica propriedade baseado no tipo de recurso
    switch (resource) {
      case 'campaigns':
        const { data: campaign } = await supabase
          .from('campaigns')
          .select('missionary_id')
          .eq('id', resourceId)
          .single()
        return campaign?.missionary_id === userId

      case 'donations':
        const { data: donation } = await supabase
          .from('donations')
          .select('donor_id')
          .eq('id', resourceId)
          .single()
        return donation?.donor_id === userId

      case 'organizations':
        const { data: organization } = await supabase
          .from('organizations')
          .select('owner_id')
          .eq('id', resourceId)
          .single()
        return organization?.owner_id === userId

      default:
        return false
    }
  } catch (error) {
    console.error('Error checking resource ownership:', error)
    return false
  }
}

// Middleware para verificar propriedade do recurso
export function requireResourceOwnership(resource: string) {
  return async function(req: NextRequest) {
    const resourceId = req.nextUrl.searchParams.get('id')
    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    const isOwner = await checkResourceOwnership(req, resource, resourceId)

    if (!isOwner) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.next()
  }
}
