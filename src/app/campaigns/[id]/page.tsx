import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DonationForm } from '@/components/donations/DonationForm'
import { formatCurrency } from '@/lib/utils/format'

type Props = {
  params: {
    id: string
  }
}

export default async function CampaignPage({ params }: Props) {
  const supabase = createClient()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select(`
      *,
      missionary:missionary_id(
        id,
        name,
        avatar_url,
        bio,
        location
      )
    `)
    .eq('id', params.id)
    .single()

  if (!campaign) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Imagem de capa */}
          <div className="relative h-64 md:h-96">
            <Image
              src={campaign.cover_image_url}
              alt={campaign.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6">
            {/* Cabeçalho */}
            <div className="flex items-center mb-6">
              <div className="relative w-16 h-16 mr-4">
                <Image
                  src={campaign.missionary.avatar_url || '/default-avatar.png'}
                  alt={campaign.missionary.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {campaign.title}
                </h1>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">{campaign.missionary.name}</span>
                  {campaign.missionary.location && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{campaign.missionary.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Progresso */}
            <div className="mb-8">
              <div className="flex justify-between text-lg mb-2">
                <span className="font-medium">
                  {formatCurrency(campaign.current_amount)}
                </span>
                <span className="text-gray-600">
                  meta de {formatCurrency(campaign.goal)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      (campaign.current_amount / campaign.goal) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
              <div className="text-sm text-gray-600">
                {new Date(campaign.deadline) > new Date() ? (
                  <>
                    Termina em{' '}
                    {new Date(campaign.deadline).toLocaleDateString('pt-BR')}
                  </>
                ) : (
                  <span className="text-red-500">Campanha encerrada</span>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-semibold mb-4">Sobre a Campanha</h2>
              <div className="whitespace-pre-wrap">{campaign.description}</div>
            </div>

            {/* Sobre o Missionário */}
            {campaign.missionary.bio && (
              <div className="prose max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Sobre {campaign.missionary.name}
                </h2>
                <div className="whitespace-pre-wrap">
                  {campaign.missionary.bio}
                </div>
              </div>
            )}

            {/* Formulário de Doação */}
            {new Date(campaign.deadline) > new Date() && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Faça sua Doação
                </h2>
                <DonationForm campaignId={campaign.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
