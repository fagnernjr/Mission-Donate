import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { CTA } from '@/components/home/CTA'
import { CampaignGrid } from '@/components/campaigns/CampaignGrid'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select(`
      *,
      profile:profiles(id, full_name, photo_url)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <main>
      <Hero />
      
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Campanhas em Destaque
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Conheça algumas das campanhas missionárias que estão transformando vidas
              ao redor do mundo.
            </p>
          </div>
          
          <div className="mt-16">
            <CampaignGrid campaigns={campaigns || []} />
          </div>
        </div>
      </section>
      
      <Features />
      <CTA />
    </main>
  )
}
