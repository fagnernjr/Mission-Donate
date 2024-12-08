'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Missionary = {
  id: string
  full_name: string
  avatar_url: string | null
  bio: string
  location: {
    city: string
    state: string
    country: string
  }
  role: string
  campaigns: {
    id: string
    title: string
    status: string
  }[]
}

type MissionaryListProps = {
  missionary: Missionary
}

export function MissionaryList({ missionary }: MissionaryListProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-64 w-full">
        <Image 
          src={missionary.avatar_url || '/default-missionary.jpg'} 
          alt={missionary.full_name} 
          fill 
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{missionary.full_name}</h3>
        <p className="text-muted-foreground mb-2">
          {missionary.location.city}, {missionary.location.state}, {missionary.location.country}
        </p>
        <p className="text-sm mb-4">{missionary.bio}</p>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/missionaries/${missionary.id}`}>
            Ver Detalhes
          </Link>
        </Button>
      </div>
    </div>
  )
}
