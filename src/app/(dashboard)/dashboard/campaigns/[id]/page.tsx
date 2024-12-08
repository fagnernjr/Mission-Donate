'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useCampaigns } from '@/hooks/useCampaigns'
import { type Campaign } from '@/types/database'

export default function CampaignPage() {
  const { id } = useParams()
  const { getCampaign } = useCampaigns()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const data = await getCampaign(id as string)
        setCampaign(data)
      } catch (err) {
        console.error(err)
        setError('Erro ao carregar campanha')
      } finally {
        setLoading(false)
      }
    }

    loadCampaign()
  }, [id, getCampaign])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Campanha não encontrada'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{campaign.title}</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {campaign.image_url && (
            <img
              src={campaign.image_url}
              alt={campaign.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {campaign.status === 'active' ? 'Ativa' : 
                 campaign.status === 'draft' ? 'Rascunho' : 
                 campaign.status === 'paused' ? 'Pausada' : 'Concluída'}
              </span>
              <div className="text-gray-600">
                Meta: R$ {campaign.goal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600">{campaign.description}</p>
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Arrecadado até agora</p>
                  <p className="text-2xl font-bold">
                    R$ {campaign.current_amount.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Progresso</p>
                  <p className="text-2xl font-bold">
                    {Math.round((campaign.current_amount / campaign.goal) * 100)}%
                  </p>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      (campaign.current_amount / campaign.goal) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Link público da campanha:</p>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {`${window.location.origin}/campaigns/${campaign.id}`}
                </code>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/campaigns/${campaign.id}`
                  )
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Copiar Link
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
