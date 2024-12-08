'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Document } from '@/types/database'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FaUpload, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa'

interface DocumentUploadProps {
  type: Document['type']
  title: string
  description: string
  acceptedFileTypes?: string
  maxSizeMB?: number
}

export function DocumentUpload({
  type,
  title,
  description,
  acceptedFileTypes = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [document, setDocument] = useState<Document | null>(null)
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validar tamanho do arquivo
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`O arquivo deve ter no máximo ${maxSizeMB}MB`)
      return
    }

    // Validar tipo do arquivo
    const fileType = selectedFile.type
    if (!acceptedFileTypes.includes(fileType.split('/')[1])) {
      setError(`Tipo de arquivo não permitido. Use: ${acceptedFileTypes}`)
      return
    }

    setFile(selectedFile)
    setError('')
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Upload do arquivo para o storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${type}/${Date.now()}.${fileExt}`
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Criar registro do documento no banco
      const { error: dbError, data: dbData } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          type,
          name: file.name,
          url: uploadData.path,
          verified: false
        })
        .select()
        .single()

      if (dbError) throw dbError

      setDocument(dbData)
      setFile(null)
    } catch (err) {
      console.error('Erro no upload:', err)
      setError('Não foi possível fazer o upload do documento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {document ? (
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <FaCheck className="text-green-500" />
            <span className="text-sm font-medium">{document.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            {document.verified ? (
              <span className="text-xs text-green-500">Verificado</span>
            ) : (
              <span className="text-xs text-yellow-500">Aguardando verificação</span>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor={`file-${type}`} className="sr-only">
                Escolher arquivo
              </Label>
              <Input
                id={`file-${type}`}
                type="file"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>
            {file && (
              <Button
                onClick={handleUpload}
                disabled={loading}
                className="min-w-[100px]"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaUpload className="mr-2" />
                )}
                Upload
              </Button>
            )}
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-500 text-sm">
              <FaTimes />
              <span>{error}</span>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Formatos aceitos: {acceptedFileTypes}
            <br />
            Tamanho máximo: {maxSizeMB}MB
          </div>
        </div>
      )}
    </Card>
  )
}
