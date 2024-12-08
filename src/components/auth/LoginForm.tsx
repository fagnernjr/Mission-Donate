'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { validateEmail } from '@/lib/validations/auth'

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true)
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
    } catch (err) {
      console.error(`Erro ao fazer login com ${provider}:`, err)
      setErrors(prev => ({ 
        ...prev, 
        social: `Erro ao fazer login com ${provider}. Tente novamente.` 
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    
    // Validar email
    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError
    }
    
    // Validar senha
    if (!formData.password) {
      newErrors.password = 'A senha é obrigatória'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ submit: 'Email ou senha incorretos.' })
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ submit: 'Por favor, confirme seu email antes de fazer login.' })
        } else {
          throw error
        }
        return
      }
      
      const redirectedFrom = searchParams.get('redirectedFrom')
      router.push(redirectedFrom || '/dashboard')
    } catch (err) {
      console.error('Erro no login:', err)
      setErrors(prev => ({
        ...prev,
        submit: err instanceof Error ? err.message : 'Falha no login. Tente novamente.'
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              placeholder="nome@exemplo.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Senha
            </label>
            <Input
              id="password"
              name="password"
              placeholder="sua senha"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={loading}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              required
            />
          </div>
        </div>

        {errors.submit && (
          <div className="text-sm text-red-500 mt-2">
            {errors.submit}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continue com
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
        >
          <FaGoogle className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('facebook')}
          disabled={loading}
        >
          <FaFacebook className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-2 text-center text-sm">
        <Link
          href="/register"
          className="text-blue-500 hover:underline"
        >
          Criar uma conta
        </Link>
        <Link
          href="/forgot-password"
          className="text-blue-500 hover:underline"
        >
          Esqueceu sua senha?
        </Link>
      </div>
    </div>
  )
}
