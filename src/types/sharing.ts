export type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'whatsapp'
  | 'telegram'
  | 'linkedin'
  | 'instagram'
  | 'tiktok'
  | 'email'

export interface ShareData {
  title: string
  description: string
  url: string
  image?: string
}
