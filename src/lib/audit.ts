import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type AuditLogLevel = 'info' | 'warning' | 'error'

export interface AuditLog {
  user_id?: string
  action: string
  resource: string
  resource_id?: string
  details: Record<string, any>
  level: AuditLogLevel
  ip_address?: string
  user_agent?: string
  created_at?: string
}

export async function logAudit({
  user_id,
  action,
  resource,
  resource_id,
  details,
  level = 'info',
  ip_address,
  user_agent,
}: AuditLog) {
  try {
    const { error } = await supabase.from('audit_logs').insert([
      {
        user_id,
        action,
        resource,
        resource_id,
        details,
        level,
        ip_address,
        user_agent,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) throw error

    // Se for um erro ou alerta, também registra no console em desenvolvimento
    if (process.env.NODE_ENV === 'development' && (level === 'error' || level === 'warning')) {
      console.log(`[AUDIT ${level.toUpperCase()}]`, {
        user_id,
        action,
        resource,
        resource_id,
        details,
        ip_address,
        user_agent,
      })
    }
  } catch (error) {
    // Em caso de erro ao registrar o log, pelo menos registra no console
    console.error('Error logging audit:', error)
  }
}

// Exemplos de uso:
export const auditActions = {
  // Auth
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  PASSWORD_RESET: 'password_reset',
  PASSWORD_CHANGE: 'password_change',
  PROFILE_UPDATE: 'profile_update',

  // Campaigns
  CAMPAIGN_CREATE: 'campaign_create',
  CAMPAIGN_UPDATE: 'campaign_update',
  CAMPAIGN_DELETE: 'campaign_delete',

  // Donations
  DONATION_CREATE: 'donation_create',
  DONATION_UPDATE: 'donation_update',
  DONATION_REFUND: 'donation_refund',

  // Organizations
  ORGANIZATION_CREATE: 'organization_create',
  ORGANIZATION_UPDATE: 'organization_update',
  ORGANIZATION_DELETE: 'organization_delete',

  // Admin
  USER_BLOCK: 'user_block',
  USER_UNBLOCK: 'user_unblock',
  CAMPAIGN_APPROVE: 'campaign_approve',
  CAMPAIGN_REJECT: 'campaign_reject',
} as const

export const auditResources = {
  USER: 'user',
  PROFILE: 'profile',
  CAMPAIGN: 'campaign',
  DONATION: 'donation',
  ORGANIZATION: 'organization',
  PAYMENT: 'payment',
} as const

// Função helper para criar logs de auditoria com tipo
export function createAuditLog(
  action: keyof typeof auditActions,
  resource: keyof typeof auditResources,
  {
    user_id,
    resource_id,
    details,
    level = 'info',
    ip_address,
    user_agent,
  }: Omit<AuditLog, 'action' | 'resource'>
) {
  return logAudit({
    user_id,
    action: auditActions[action],
    resource: auditResources[resource],
    resource_id,
    details,
    level,
    ip_address,
    user_agent,
  })
}
