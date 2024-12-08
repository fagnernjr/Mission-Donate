export type PaymentMethod = 'credit_card' | 'pix'

export type DonationType = 'single' | 'recurring'

export type RecurringFrequency = 'monthly' | 'quarterly' | 'yearly'

export interface DonationDetails {
  campaignId: string
  donorId: string
  amount: number
  type: DonationType
  paymentMethod: PaymentMethod
  anonymous: boolean
  recurringFrequency?: RecurringFrequency
  message?: string
}

export interface DonationReceipt {
  id: string
  donationDetails: DonationDetails
  campaignTitle: string
  donorName: string
  donorDocument: string
  donorEmail: string
  createdAt: Date
  status: 'pending' | 'completed' | 'failed'
  transactionId?: string
  paymentProof?: {
    url: string
    type: string
  }
}
