import { z } from 'zod'

// Regex patterns
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/
const CPF_REGEX = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
const CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/

// Common schemas
const emailSchema = z.string().email('Email inválido')
const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial')

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['donor', 'user']),
  phone: z.string().regex(PHONE_REGEX, 'Número de telefone inválido'),
  document: z.string().regex(CPF_REGEX, 'CPF inválido'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
})

// Campaign schemas
export const campaignSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  goal: z.number().min(1, 'Meta deve ser maior que 0'),
  endDate: z.date().min(new Date(), 'Data final deve ser maior que a data atual'),
  image: z.string().url('URL da imagem inválida').optional(),
})

// Donation schemas
export const donationSchema = z.object({
  amount: z.number().min(1, 'Valor deve ser maior que 0'),
  campaignId: z.string().uuid('ID da campanha inválido'),
  paymentMethod: z.enum(['credit_card', 'pix', 'boleto']),
  isRecurring: z.boolean(),
  frequency: z.enum(['monthly', 'quarterly', 'yearly']).optional(),
})

// Profile schemas
export const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  phone: z.string().regex(PHONE_REGEX, 'Número de telefone inválido'),
  document: z.string().regex(CPF_REGEX, 'CPF inválido'),
  bio: z.string().max(500, 'Biografia deve ter no máximo 500 caracteres').optional(),
  avatar: z.string().url('URL do avatar inválida').optional(),
})

// Organization schemas
export const organizationSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  document: z.string().regex(CNPJ_REGEX, 'CNPJ inválido'),
  phone: z.string().regex(PHONE_REGEX, 'Número de telefone inválido'),
  email: emailSchema,
  address: z.object({
    street: z.string().min(3, 'Rua deve ter no mínimo 3 caracteres'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(3, 'Bairro deve ter no mínimo 3 caracteres'),
    city: z.string().min(3, 'Cidade deve ter no mínimo 3 caracteres'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
  }),
})

// Sanitization functions
export const sanitizeHtml = (html: string) => {
  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove onclick and other dangerous attributes
  html = html.replace(/ on\w+="[^"]*"/g, '')
  
  // Remove javascript: URLs
  html = html.replace(/javascript:/gi, '')
  
  // Remove data: URLs
  html = html.replace(/data:/gi, '')
  
  return html
}

export const sanitizeInput = (input: string) => {
  // Remove HTML tags
  input = input.replace(/<[^>]*>/g, '')
  
  // Remove special characters
  input = input.replace(/[<>'"]/g, '')
  
  // Trim whitespace
  input = input.trim()
  
  return input
}
