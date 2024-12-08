'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

// Esquema de validação para o formulário de doação
const donationSchema = z.object({
  amount: z.number().min(5, 'Valor mínimo de R$ 5'),
  isRecurring: z.boolean().optional(),
  interval: z.enum(['month', 'year']).optional(),
  paymentMethod: z.enum(['card', 'pix']),
})

type DonationFormProps = {
  campaignId: string
}

export function DonationForm({ campaignId }: DonationFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 10,
      isRecurring: false,
      interval: 'month',
      paymentMethod: 'card'
    }
  })

  const isRecurring = watch('isRecurring')
  const paymentMethod = watch('paymentMethod')

  const onSubmit = async (data: z.infer<typeof donationSchema>) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Removido a lógica de criação de checkout
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Faça sua Doação
      </h2>

      {/* Campo de valor */}
      <div className="mb-4">
        <label 
          htmlFor="amount" 
          className="block text-gray-700 font-bold mb-2"
        >
          Valor da Doação (R$)
        </label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[10, 50, 100].map((value) => (
            <Button
              key={value}
              type="button"
              onClick={() => {
                const event = {
                  target: { value: value.toString() }
                } as React.ChangeEvent<HTMLInputElement>
                register('amount').onChange(event)
              }}
              className="py-2 px-4 border rounded-md hover:bg-gray-50"
            >
              R$ {value}
            </Button>
          ))}
        </div>
        <Input
          type="number"
          id="amount"
          {...register('amount', { 
            setValueAs: (v) => Number(v) 
          })}
          min={5}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Digite o valor"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">
            {errors.amount.message}
          </p>
        )}
      </div>

      {/* Método de pagamento */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Método de Pagamento
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              {...register('paymentMethod')}
              value="card"
              className="mr-2"
            />
            <span>Cartão de Crédito</span>
          </label>
          <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              {...register('paymentMethod')}
              value="pix"
              className="mr-2"
            />
            <span>PIX</span>
          </label>
        </div>
      </div>

      {/* Opção de doação recorrente - apenas para cartão */}
      {paymentMethod === 'card' && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="isRecurring"
              {...register('isRecurring')}
              className="mr-2"
            />
            <label 
              htmlFor="isRecurring" 
              className="text-gray-700"
            >
              Deseja fazer uma doação recorrente?
            </label>
          </div>

          {/* Intervalo de recorrência */}
          {isRecurring && (
            <div className="mt-2">
              <label 
                htmlFor="interval" 
                className="block text-gray-700 font-bold mb-2"
              >
                Intervalo de Doação
              </label>
              <select
                id="interval"
                {...register('interval')}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="month">Mensal</option>
                <option value="year">Anual</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Botão de envio */}
      <Button
        type="submit"
        disabled={isProcessing}
        className={`
          w-full py-2 px-4 rounded-md 
          ${isProcessing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }
        `}
      >
        {isProcessing ? 'Processando...' : 'Doar Agora'}
      </Button>

      {/* Mensagem de erro */}
      {error && (
        <div 
          className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
          role="alert"
        >
          {error}
        </div>
      )}
    </form>
  )
}
