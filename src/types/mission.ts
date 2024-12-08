export type MissionType = 
  | 'evangelismo'
  | 'assistencial'
  | 'educacional'
  | 'saude'
  | 'construcao'
  | 'traducao'

export type MissionUrgency = 'baixa' | 'media' | 'alta' | 'emergencial'

export interface MissionLocation {
  coordinates: [number, number] // [longitude, latitude]
  region: string
  city: string
  state: string
  country: string
}

export interface MissionUpdate {
  id: string
  date: Date
  title: string
  content: string
  media?: {
    type: 'image' | 'video'
    url: string
  }[]
}

export interface MissionTestimonial {
  id: string
  date: Date
  author: string
  content: string
  rating?: number
  media?: {
    type: 'image' | 'video'
    url: string
  }[]
}

export interface MissionMedia {
  id: string
  type: 'image' | 'video'
  url: string
  title?: string
  description?: string
}

export interface MissionGoal {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
}

export interface MissionStatistics {
  totalDonors: number
  totalDonations: number
  averageDonation: number
  largestDonation: number
  donationVelocity: number // doações por dia
  estimatedCompletionDays: number | null
}

export interface Mission {
  id: string
  title: string
  shortDescription: string
  detailedDescription: string
  missionType: MissionType
  urgency: MissionUrgency
  location: MissionLocation
  startDate: Date
  endDate: Date
  goalAmount: number
  currentAmount: number
  goals: MissionGoal[]
  updates: MissionUpdate[]
  testimonials: MissionTestimonial[]
  mediaGallery: MissionMedia[]
  featured: boolean
  statistics: MissionStatistics
}

export interface MissionFilters {
  region?: string
  missionType?: MissionType
  urgency?: MissionUrgency
  minAmount?: number
  maxAmount?: number
  startDate?: Date
  endDate?: Date
  featured?: boolean
}

export interface MissionSortOptions {
  field: 'urgency' | 'currentAmount' | 'endDate' | 'donationVelocity'
  direction: 'asc' | 'desc'
}
