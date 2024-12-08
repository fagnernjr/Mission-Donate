'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { useCampaigns } from '@/hooks/useCampaigns'
import { campaignSchema, type CampaignFormData } from '@/lib/validations/campaign'
import { ImageUpload } from './ImageUpload'

export function CampaignForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuthContext()
  const { createCampaign } = useCampaigns()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  })

  const onSubmit = async (data: CampaignFormData) => {
    if (!user) return

    setError('')
    setLoading(true)

    try {
      const campaign = await createCampaign({
        ...data,
        user_id: user.id,
      })

      router.push(`/dashboard/campaigns/${campaign.id}`)
    } catch (err) {
      console.error(err)
      setError('Erro ao criar campanha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (url: string) => {
    setValue('cover_image_url', url)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Nova Campanha</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Título
          </label>
          <input
            id="title"
            {...register('title')}
            className="w-full px-3 py-2 border rounded-md"
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            disabled={loading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="goal" className="block text-sm font-medium mb-1">
            Meta da Campanha
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="number"
              id="goal"
              step="0.01"
              min="0"
              className="form-input block w-full pl-10 pr-12 sm:text-sm rounded-md"
              placeholder="0,00"
              {...register('goal', { valueAsNumber: true })}
            />
          </div>
          {errors.goal && (
            <p className="mt-1 text-sm text-red-600">{errors.goal.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Imagem de Capa
          </label>
          <ImageUpload 
            onUploadComplete={handleImageUpload}
            currentImageUrl={register('cover_image_url').value}
          />
          {errors.cover_image_url && (
            <p className="mt-1 text-sm text-red-600">{errors.cover_image_url.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium mb-1">
              Data de Início
            </label>
            <input
              id="start_date"
              type="datetime-local"
              {...register('start_date')}
              className="w-full px-3 py-2 border rounded-md"
              disabled={loading}
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium mb-1">
              Data de Término
            </label>
            <input
              id="end_date"
              type="datetime-local"
              {...register('end_date')}
              className="w-full px-3 py-2 border rounded-md"
              disabled={loading}
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="w-full px-3 py-2 border rounded-md"
            disabled={loading}
          >
            <option value="draft">Rascunho</option>
            <option value="active">Ativa</option>
            <option value="paused">Pausada</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Campanha'}
          </button>
        </div>
      </form>
    </div>
  )
}
