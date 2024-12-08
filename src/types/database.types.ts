export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          goal_amount: number
          current_amount: number
          deadline: string
          cover_image_url: string
          missionary_id: string
          status: 'active' | 'completed' | 'cancelled'
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          goal_amount: number
          current_amount?: number
          deadline: string
          cover_image_url: string
          missionary_id: string
          status?: 'active' | 'completed' | 'cancelled'
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          goal_amount?: number
          current_amount?: number
          deadline?: string
          cover_image_url?: string
          missionary_id?: string
          status?: 'active' | 'completed' | 'cancelled'
        }
      }
      donations: {
        Row: {
          id: string
          created_at: string
          campaign_id: string
          donor_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed'
          payment_intent_id: string
          payment_method: 'card' | 'pix'
          donor_email?: string
          receipt_url?: string
        }
        Insert: {
          id?: string
          created_at?: string
          campaign_id: string
          donor_id: string
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          payment_intent_id: string
          payment_method: 'card' | 'pix'
          donor_email?: string
          receipt_url?: string
        }
        Update: {
          id?: string
          created_at?: string
          campaign_id?: string
          donor_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          payment_intent_id?: string
          payment_method?: 'card' | 'pix'
          donor_email?: string
          receipt_url?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          inserted_at: string
          status: string
          subscription_id: string
          updated_at: string
          campaign_id: string
          donor_id: string
          amount: number
          interval: 'month' | 'year'
        }
        Insert: {
          id?: string
          inserted_at?: string
          status?: string
          subscription_id?: string
          updated_at?: string
          campaign_id: string
          donor_id: string
          amount: number
          interval: 'month' | 'year'
        }
        Update: {
          id?: string
          inserted_at?: string
          status?: string
          subscription_id?: string
          updated_at?: string
          campaign_id?: string
          donor_id?: string
          amount?: number
          interval?: 'month' | 'year'
        }
      }
    }
  }
}
