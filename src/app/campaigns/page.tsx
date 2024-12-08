import { CampaignList } from '@/components/campaigns/CampaignList'
import { createClient } from '@/lib/supabase/server'
import { Campaign } from '@/types/database'

export const revalidate = 3600 // revalidate every hour

export default async function CampaignsPage() {
  const supabase = createClient()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select(`
      id,
      title,
      description,
      goal,
      current_amount,
      end_date,
      status,
      user:user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .returns<Campaign[]>()

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Campanhas Ativas</h1>
          <p className="text-muted-foreground">
            Conheça e apoie as campanhas missionárias ativas no momento.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns?.map((campaign) => (
            <CampaignList key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </div>
  )
}
