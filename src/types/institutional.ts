export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    instagram?: string
  }
}

export interface Value {
  title: string
  description: string
  icon: string
}

export interface Timeline {
  year: number
  title: string
  description: string
  imageUrl?: string
}

export interface Report {
  id: string
  title: string
  description: string
  year: number
  quarter?: number
  type: 'financial' | 'impact' | 'annual'
  fileUrl: string
  thumbnailUrl?: string
  publishedAt: Date
}

export interface Metric {
  label: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export interface Partner {
  id: string
  name: string
  description?: string
  logoUrl: string
  websiteUrl?: string
}
