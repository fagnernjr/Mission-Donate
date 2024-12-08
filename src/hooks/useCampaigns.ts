import { createClient } from '@/lib/supabase/client'
import { type Campaign } from '@/types/database'
import { useCallback } from 'react'

export function useCampaigns() {
  const supabase = createClient()

  const createCampaign = useCallback(async (campaignData: Omit<Campaign, 'id' | 'created_at' | 'current_amount' | 'status'>) => {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        ...campaignData,
        current_amount: 0,
        status: 'active'
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }, [supabase])

  const getMyCampaigns = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        profile:user_id (
          id,
          full_name,
          photo_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }, [supabase])

  const getCampaign = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        profile:user_id (
          id,
          full_name,
          photo_url
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }, [supabase])

  return {
    createCampaign,
    getMyCampaigns,
    getCampaign,
  }
}
