import { createClient } from '@/lib/supabase/client'
import { DonorProfile, DonorPreferences, DonationHistory, DonorStatistics } from '@/types/donor'

export async function getDonorProfile(userId: string): Promise<DonorProfile | null> {
  const supabase = createClient()

  // Fetch preferences
  const { data: preferences, error: preferencesError } = await supabase
    .from('donor_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (preferencesError) {
    console.error('Error fetching donor preferences:', preferencesError)
    throw preferencesError
  }

  // Fetch statistics
  const { data: statistics, error: statisticsError } = await supabase
    .rpc('get_donor_statistics', { donor_uuid: userId })
    .single()

  if (statisticsError) {
    console.error('Error fetching donor statistics:', statisticsError)
    throw statisticsError
  }

  // Fetch donation history
  const { data: history, error: historyError } = await supabase
    .from('donor_contribution_history')
    .select('*')
    .eq('donor_id', userId)
    .order('created_at', { ascending: false })

  if (historyError) {
    console.error('Error fetching donation history:', historyError)
    throw historyError
  }

  return {
    preferences: preferences as DonorPreferences,
    statistics: statistics as DonorStatistics,
    donationHistory: history as DonationHistory[],
  }
}

export async function updateDonorPreferences(
  userId: string,
  preferences: Partial<DonorPreferences>
): Promise<DonorPreferences> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('donor_preferences')
    .upsert({
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error updating donor preferences:', error)
    throw error
  }

  return data as DonorPreferences
}

export async function getDonationHistory(
  userId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{ data: DonationHistory[]; total: number }> {
  const supabase = createClient()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('donor_contribution_history')
    .select('*', { count: 'exact' })
    .eq('donor_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching donation history:', error)
    throw error
  }

  return {
    data: data as DonationHistory[],
    total: count || 0,
  }
}
