'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types/database'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { DocumentUpload } from './DocumentUpload'

export function UserProfile() {
  const [user, setUser] = useState<Partial<Profile>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user: userData } } = await supabase.auth.getUser()
      if (!userData) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.id)
        .single()

      if (error) throw error
      setUser(data)
    } catch (err) {
      console.error('Erro ao carregar perfil:', err)
      setError('Não foi possível carregar seu perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    setUser(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value
      }
    }))
  }

  const handleBankInfoChange = (field: string, value: string) => {
    setUser(prev => ({
      ...prev,
      bank_info: {
        ...prev.bank_info,
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update(user)
        .eq('id', user.id)

      if (error) throw error

      alert('Perfil atualizado com sucesso!')
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err)
      setError('Não foi possível atualizar seu perfil')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e de contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nome Completo</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={user.full_name || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={user.phone || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                    <Input
                      id="birth_date"
                      name="birth_date"
                      type="date"
                      value={user.birth_date || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document_number">CPF/RG</Label>
                    <Input
                      id="document_number"
                      name="document_number"
                      value={user.document_number || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={user.bio || ''}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      name="address"
                      value={user.address || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      value={user.city || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      name="state"
                      value={user.state || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">CEP</Label>
                    <Input
                      id="postal_code"
                      name="postal_code"
                      value={user.postal_code || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Redes Sociais</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={user.social_media?.facebook || ''}
                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={user.social_media?.instagram || ''}
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações Bancárias</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank_name">Banco</Label>
                      <Input
                        id="bank_name"
                        value={user.bank_info?.bank_name || ''}
                        onChange={(e) => handleBankInfoChange('bank_name', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account_type">Tipo de Conta</Label>
                      <Input
                        id="account_type"
                        value={user.bank_info?.account_type || ''}
                        onChange={(e) => handleBankInfoChange('account_type', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account_number">Número da Conta</Label>
                      <Input
                        id="account_number"
                        value={user.bank_info?.account_number || ''}
                        onChange={(e) => handleBankInfoChange('account_number', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch_number">Agência</Label>
                      <Input
                        id="branch_number"
                        value={user.bank_info?.branch_number || ''}
                        onChange={(e) => handleBankInfoChange('branch_number', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pix_key">Chave PIX</Label>
                      <Input
                        id="pix_key"
                        value={user.bank_info?.pix_key || ''}
                        onChange={(e) => handleBankInfoChange('pix_key', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>
                Faça upload dos documentos necessários para verificação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <DocumentUpload
                type="identity"
                title="Documento de Identificação"
                description="Upload do seu RG ou CNH (frente e verso)"
                acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                maxSizeMB={5}
              />

              <DocumentUpload
                type="mission_proof"
                title="Comprovação de Missão"
                description="Documentos que comprovem sua atuação missionária (certificados, cartas de recomendação, etc)"
                acceptedFileTypes=".pdf"
                maxSizeMB={10}
              />

              <DocumentUpload
                type="certification"
                title="Certificações"
                description="Certificados de cursos, treinamentos ou formação teológica"
                acceptedFileTypes=".pdf"
                maxSizeMB={10}
              />

              <DocumentUpload
                type="support"
                title="Documentos de Suporte"
                description="Outros documentos relevantes para sua missão"
                acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                maxSizeMB={10}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
