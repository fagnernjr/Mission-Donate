'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <div className="relative isolate overflow-hidden bg-primary-500">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Faça parte desta missão.
            <br />
            Comece a doar hoje.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-50">
            Sua doação pode fazer a diferença na vida de muitas pessoas.
            Junte-se a nós nessa jornada de transformação.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              as={Link}
              href="/register"
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              Criar uma Conta
            </Button>
            <Button
              as={Link}
              href="/campaigns"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-primary-600"
            >
              Ver Campanhas
            </Button>
          </div>
        </div>
      </div>
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        aria-hidden="true"
      >
        <circle
          cx={512}
          cy={512}
          r={512}
          fill="url(#gradient)"
          fillOpacity="0.15"
        />
        <defs>
          <radialGradient id="gradient">
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#fff" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
