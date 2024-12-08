'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { type UserRole } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { validatePassword, validateEmail, validateFullName } from '@/lib/validations/auth'
import { FaGoogle, FaFacebook } from 'react-icons/fa'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'donor' as UserRole,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Validar nome completo
    const fullNameError = validateFullName(formData.fullName)
    if (fullNameError) newErrors.fullName = fullNameError
    
    // Validar email
    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError
    
    // Validar senha
    const passwordError = validatePassword(formData.password)
    if (passwordError) newErrors.password = passwordError
    
    // Validar confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (!validateForm()) return
    
    setLoading(true)
    const supabase = createClient()

    try {
      // Verificar se o email já existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single()

      if (existingUser) {
        setErrors(prev => ({
          ...prev,
          email: 'Este email já está cadastrado. Por favor, use outro email ou faça login.'
        }))
        return
      }

      // Criar usuário
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) throw signUpError

      // Sucesso
      alert('Registro realizado com sucesso! Verifique seu email para confirmar a conta.')
      router.push('/login')
    } catch (err) {
      console.error('Erro no registro:', err)
      setErrors(prev => ({
        ...prev,
        submit: err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.'
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Input
            id="fullName"
            name="fullName"
            placeholder="Nome completo"
            type="text"
            autoCapitalize="words"
            autoComplete="name"
            autoCorrect="off"
            disabled={loading}
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />
          
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
            error={errors.email}
            required
          />
          
          <Input
            id="password"
            name="password"
            placeholder="Crie uma senha"
            type="password"
            autoComplete="new-password"
            disabled={loading}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          
          <Input
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirme sua senha"
            type="password"
            autoComplete="new-password"
            disabled={loading}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
          
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
            className={cn(
              "w-full px-3 py-2 border rounded-md",
              errors.role && "border-red-500"
            )}
            required
          >
            <option value="donor">Doador</option>
            <option value="organization">Missionário</option>
          </select>
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
          {loading ? 'Criando conta...' : 'Criar conta'}
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

      <div className="text-center text-sm">
        <Link
          href="/login"
          className="text-blue-500 hover:underline"
        >
          Já tem uma conta? Faça login
        </Link>
      </div>
    </div>
  )
}
