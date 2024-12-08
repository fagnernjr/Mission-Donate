'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface UserListProps {
  user: {
    id: string
    full_name: string
    avatar_url: string | null
    bio: string | null
    location: string | null
    campaigns: Array<{
      id: string
      title: string
      status: string
    }>
  }
}

export function UserList({ user }: UserListProps) {
  const activeCampaigns = user.campaigns?.filter(
    (campaign) => campaign.status === 'active'
  )

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={user.avatar_url || '/placeholder.png'}
          alt={user.full_name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold tracking-tight">{user.full_name}</h3>
            {user.location && (
              <p className="text-sm text-muted-foreground">{user.location}</p>
            )}
          </div>

          {user.bio && (
            <p className="text-sm text-muted-foreground line-clamp-3">{user.bio}</p>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {activeCampaigns.length} campanha(s) ativa(s)
            </span>
          </div>

          <Button asChild className="w-full">
            <Link href={`/users/${user.id}`}>Ver Perfil</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
