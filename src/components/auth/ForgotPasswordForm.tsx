'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      // Primeiro, verifica se o email existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (!existingUser) {
        throw new Error('Email não encontrado. Verifique se digitou corretamente.')
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
      
      setSuccess(true)
    } catch (err) {
      console.error('Reset password error:', err)
      setError(err instanceof Error ? err.message : 'Não foi possível enviar o email de recuperação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Email enviado!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Se houver uma conta associada ao email {email}, você receberá instruções para redefinir sua senha.
          <br /><br />
          Verifique sua caixa de entrada e a pasta de spam.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Recuperar senha</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Digite seu email e enviaremos instruções para redefinir sua senha.
        </p>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
          disabled={loading}
          placeholder="seu@email.com"
        />
      </div>
      {error && (
        <div className="text-sm text-red-500 mt-2">{error}</div>
      )}
      <Button
        type="submit"
        className={cn(
          "w-full",
          loading && "opacity-50 cursor-not-allowed"
        )}
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Enviar instruções'}
      </Button>
    </form>
  )
}
