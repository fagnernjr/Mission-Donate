import { z } from 'zod'

export const campaignSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres'),
  goal: z
    .number({
      required_error: 'Meta da campanha é obrigatória',
      invalid_type_error: 'Meta deve ser um número válido',
    })
    .positive('Meta deve ser um valor positivo')
    .max(1000000, 'Meta não pode ser maior que R$ 1.000.000'),
  cover_image_url: z
    .string()
    .url('URL da imagem inválida')
    .optional()
    .nullable(),
  start_date: z
    .string()
    .datetime()
    .optional()
    .nullable(),
  end_date: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true
        return new Date(date) > new Date()
      },
      'Data final deve ser no futuro'
    ),
  status: z.enum(['draft', 'active', 'paused', 'completed']).default('draft'),
})

export type CampaignFormData = z.infer<typeof campaignSchema>
