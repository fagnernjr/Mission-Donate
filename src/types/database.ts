export type UserRole = 'donor' | 'organization' | 'user' | 'missionary'
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed'
export type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  birth_date?: string
  document_number?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  bio?: string
  website?: string
  social_media?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  bank_info?: {
    bank_name: string
    account_type: string
    account_number: string
    branch_number: string
    pix_key?: string
  }
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  user_id: string
  title: string
  description: string
  goal: number
  current_amount: number
  status: CampaignStatus
  image_url: string | null
  start_date: string | null
  end_date: string | null
  created_at: string
  is_active: boolean
  slug: string
  user?: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

export interface Donation {
  id: string
  campaign_id: string
  donor_id: string | null
  amount: number
  status: DonationStatus
  payment_intent_id: string | null
  donor_email: string | null
  created_at: string
}

export type Subscription = {
  id: string
  campaign_id: string
  donor_id: string
  amount: number
  status: string
  subscription_id: string
  interval: 'month' | 'year'
}

export interface Document {
  id: string
  user_id: string
  type: 'identity' | 'mission_proof' | 'certification' | 'support'
  name: string
  url: string
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  mission_id: string
  type: 'image' | 'video'
  url: string
  thumbnail_url?: string
  title?: string
  description?: string
  created_at: string
}

export interface Location {
  id: string
  mission_id: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  latitude?: number
  longitude?: number
}

export interface MissionNeed {
  id: string
  mission_id: string
  title: string
  description: string
  quantity: number
  unit: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'partial' | 'fulfilled'
  created_at: string
  updated_at: string
}

export interface BudgetItem {
  id: string
  mission_id: string
  category: string
  description: string
  amount: number
  frequency?: 'one_time' | 'monthly' | 'yearly'
  status: 'pending' | 'approved' | 'funded'
  created_at: string
  updated_at: string
}

export interface Mission {
  id: string
  user_id: string
  title: string
  description: string
  objective: string
  start_date: string
  end_date?: string
  status: 'draft' | 'pending' | 'active' | 'completed' | 'suspended'
  total_budget: number
  current_donations: number
  created_at: string
  updated_at: string
  location_id: string
  featured_image?: string
  video_url?: string
}

export interface AuthError {
  message: string
  status?: number
}

export interface BaseTable<T> {
  Row: T
  Insert: Omit<T, 'created_at' | 'id'>
  Update: Partial<Omit<T, 'created_at' | 'id'>>
}

export interface Database {
  public: {
    Tables: {
      profiles: BaseTable<Profile>
      campaigns: BaseTable<Campaign>
      donations: BaseTable<Donation>
      subscriptions: BaseTable<Subscription>
      documents: BaseTable<Document>
      media: BaseTable<Media>
      locations: BaseTable<Location>
      mission_needs: BaseTable<MissionNeed>
      budget_items: BaseTable<BudgetItem>
      missions: BaseTable<Mission>
    }
  }
}
