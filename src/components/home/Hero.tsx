'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative h-full w-full">
          <Image
            src="/patterns/mission-pattern.svg"
            alt="Background Pattern"
            fill
            className="object-cover opacity-5"
            priority
          />
        </div>
      </div>

      <div className="container relative">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20 text-center lg:min-h-[calc(100vh-5rem)]">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">Transforme vidas através de</span>
              <span className="mt-2 block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                doações missionárias
              </span>
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground">
              Apoie missionários em sua jornada de impacto e transformação.
              Cada doação é um passo em direção a um mundo melhor.
            </p>
            
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/campaigns">
                  Explorar Campanhas
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="min-w-[200px]">
                <Link href="/about">
                  Saiba Mais
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
