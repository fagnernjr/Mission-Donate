'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface CampaignListProps {
  campaign: {
    id: string
    title: string
    description: string
    goal: number
    current_amount: number
    end_date: string | null
    user?: {
      id: string
      full_name: string
      avatar_url: string | null
    }
  }
}

export function CampaignList({ campaign }: CampaignListProps) {
  const progress = (campaign.current_amount / campaign.goal) * 100
  const daysLeft = campaign.end_date ? Math.ceil(
    (new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  ) : 0

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <Image
          src={campaign.user?.avatar_url || '/placeholder.png'}
          alt={campaign.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold tracking-tight">{campaign.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
          </div>

          <div className="space-y-2">
            <Progress value={progress} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(campaign.current_amount)}</span>
              <span>{formatCurrency(campaign.goal)}</span>
            </div>
          </div>

          {campaign.user && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
                  <Image
                    src={campaign.user.avatar_url || '/placeholder.png'}
                    alt={campaign.user.full_name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{campaign.user.full_name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{daysLeft} dias restantes</span>
            </div>
          )}

          <Button asChild className="w-full">
            <Link href={`/campaigns/${campaign.id}`}>Doar Agora</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
