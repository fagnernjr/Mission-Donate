'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface CampaignCardProps {
  campaign: {
    id: string
    title: string
    description: string
    image_url: string
    goal: number
    current_amount: number
    slug: string
  }
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = (campaign.current_amount / campaign.goal) * 100
  
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-medium">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={campaign.image_url || '/placeholder-campaign.jpg'}
            alt={campaign.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          {campaign.title}
        </h3>
        
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {campaign.description}
        </p>
        
        <div className="mb-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900">
              {formatCurrency(campaign.current_amount)}
            </span>
            <span className="text-gray-500">
              de {formatCurrency(campaign.goal)}
            </span>
          </div>
          
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Link href={`/campaigns/${campaign.slug}`} className="w-full">
          <Button
            variant="default"
            size="lg"
            fullWidth
            className="bg-primary-500 text-white transition-colors hover:bg-primary-600"
          >
            Doar Agora
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
