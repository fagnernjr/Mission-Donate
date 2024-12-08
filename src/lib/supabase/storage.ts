import { createClient } from './client'

const CAMPAIGN_BUCKET = 'campaign-images'

export async function uploadCampaignImage(file: File) {
  const supabase = createClient()
  
  // Gera um nome único para o arquivo
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase
    .storage
    .from(CAMPAIGN_BUCKET)
    .upload(filePath, file)

  if (error) {
    throw error
  }

  // Retorna a URL pública da imagem
  const { data: { publicUrl } } = supabase
    .storage
    .from(CAMPAIGN_BUCKET)
    .getPublicUrl(filePath)

  return publicUrl
}

export async function deleteCampaignImage(imageUrl: string) {
  const supabase = createClient()
  
  // Extrai o nome do arquivo da URL
  const fileName = imageUrl.split('/').pop()
  
  if (!fileName) {
    throw new Error('URL de imagem inválida')
  }

  const { error } = await supabase
    .storage
    .from(CAMPAIGN_BUCKET)
    .remove([fileName])

  if (error) {
    throw error
  }
}
