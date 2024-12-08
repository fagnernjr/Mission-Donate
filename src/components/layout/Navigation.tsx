import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navigation() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-sm">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold">Mission Donate</span>
          </Link>
        </div>
        <div className="flex gap-x-12">
          <Link href="/about" className="text-sm font-semibold leading-6 hover:text-primary">
            Sobre
          </Link>
          <Link href="/missionaries" className="text-sm font-semibold leading-6 hover:text-primary">
            Missionários
          </Link>
          <Link href="/campaigns" className="text-sm font-semibold leading-6 hover:text-primary">
            Campanhas
          </Link>
        </div>
        <div className="flex flex-1 justify-end gap-x-4">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button>Cadastrar</Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
