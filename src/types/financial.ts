export interface FinancialTransaction {
  id: string
  userId: string
  campaignId?: string
  type: 'donation' | 'withdrawal' | 'refund'
  amount: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
  description: string
  metadata?: Record<string, any>
}

export interface WithdrawalRequest {
  id: string
  userId: string
  amount: number
  bankAccount: {
    bank: string
    agency: string
    account: string
    type: 'checking' | 'savings'
    holder: string
    document: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  requestedAt: Date
  processedAt?: Date
  notes?: string
}

export interface FinancialSummary {
  totalRaised: number
  totalWithdrawn: number
  availableBalance: number
  pendingBalance: number
  totalDonations: number
  totalDonors: number
  averageDonation: number
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  donations: number
  withdrawals: number
}

export interface CampaignFinancials {
  campaignId: string
  campaignTitle: string
  totalRaised: number
  goalAmount: number
  progress: number
  donorsCount: number
  lastDonationDate?: Date
}

export interface AdminFinancialReport {
  totalTransactions: number
  totalVolume: number
  activeCampaigns: number
  successRate: number
  averageTicket: number
  platformFees: number
  monthlyGrowth: number
  topCampaigns: CampaignFinancials[]
  revenueByRegion: Array<{
    region: string
    amount: number
    percentage: number
  }>
}
