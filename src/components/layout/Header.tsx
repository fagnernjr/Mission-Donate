'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">Mission Donate</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <nav className="hidden gap-6 md:flex">
              <Link
                href="/campaigns"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Campanhas
              </Link>
              <Link
                href="/missionaries"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Missionários
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Sobre
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Entrar</Link>
              </Button>

              <Button asChild size="sm">
                <Link href="/register">Criar Conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
