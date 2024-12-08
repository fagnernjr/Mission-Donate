import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/format'
import { type Campaign } from '@/types/database'

type CampaignWithProfile = Campaign & {
  profile: {
    id: string
    full_name: string | null
    photo_url: string | null
  } | null
}

type CampaignGridProps = {
  campaigns: CampaignWithProfile[]
}

export function CampaignGrid({ campaigns }: CampaignGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Link
          key={campaign.id}
          href={`/campaigns/${campaign.slug}`}
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48">
            {campaign.image_url ? (
              <Image
                src={campaign.image_url}
                alt={campaign.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Sem imagem</span>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                {campaign.profile?.photo_url ? (
                  <Image
                    src={campaign.profile.photo_url}
                    alt={campaign.profile.full_name || 'Missionário'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm text-gray-400">Foto</span>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {campaign.profile?.full_name || 'Missionário'}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {campaign.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {campaign.description}
            </p>

            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      (campaign.current_amount / campaign.goal) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {formatCurrency(campaign.current_amount)}
                </span>
                <span className="text-gray-600">
                  {formatCurrency(campaign.goal)}
                </span>
              </div>

              {campaign.end_date && (
                <p className="text-sm text-gray-500">
                  Termina em: {new Date(campaign.end_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
