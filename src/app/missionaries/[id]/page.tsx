import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CampaignGrid } from '@/components/campaigns/CampaignGrid'

type Props = {
  params: {
    id: string
  }
}

export default async function MissionaryPage({ params }: Props) {
  const supabase = createClient()

  // Buscar dados do missionário
  const { data: missionary } = await supabase
    .from('missionaries')
    .select(`
      *,
      campaigns(
        *,
        missionary:missionary_id(
          name,
          avatar_url
        )
      )
    `)
    .eq('id', params.id)
    .single()

  if (!missionary) {
    notFound()
  }

  // Filtrar apenas campanhas ativas
  const activeCampaigns = missionary.campaigns.filter(
    campaign => campaign.status === 'active'
  )

  // Filtrar campanhas encerradas
  const pastCampaigns = missionary.campaigns.filter(
    campaign => campaign.status !== 'active'
  )

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Perfil do Missionário */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="relative w-32 h-32 md:w-48 md:h-48 mb-4 md:mb-0 md:mr-8">
              <Image
                src={missionary.avatar_url || '/default-avatar.png'}
                alt={missionary.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {missionary.name}
              </h1>
              
              {missionary.location && (
                <p className="text-gray-600 mb-4">
                  📍 {missionary.location}
                </p>
              )}
              
              {missionary.bio && (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">
                    {missionary.bio}
                  </div>
                </div>
              )}
              
              {missionary.website && (
                <a
                  href={missionary.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
                >
                  🌐 Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Campanhas Ativas */}
        {activeCampaigns.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Campanhas Ativas
            </h2>
            <CampaignGrid campaigns={activeCampaigns} />
          </section>
        )}

        {/* Campanhas Encerradas */}
        {pastCampaigns.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Campanhas Anteriores
            </h2>
            <CampaignGrid campaigns={pastCampaigns} />
          </section>
        )}

        {missionary.campaigns.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            Este missionário ainda não criou nenhuma campanha.
          </div>
        )}
      </div>
    </main>
  )
}
