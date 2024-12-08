export interface DonorPreferences {
  id: string
  userId: string
  preferredCategories: string[]
  preferredPaymentMethod: string
  anonymousDonation: boolean
  notificationPreferences: {
    emailNotifications: boolean
    campaignUpdates: boolean
    monthlySummary: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface DonationHistory {
  donorId: string
  campaignId: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  createdAt: Date
  campaignTitle: string
  campaignOwnerId: string
  campaignOwnerName: string
}

export interface DonorStatistics {
  totalDonations: number
  totalAmount: number
  campaignsSupported: number
  lastDonationDate: Date | null
}

export interface DonorProfile {
  preferences: DonorPreferences
  statistics: DonorStatistics
  donationHistory: DonationHistory[]
}
