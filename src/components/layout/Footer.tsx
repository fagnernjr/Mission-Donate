'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Mission Donate
            </Link>
            <p className="text-gray-600 text-sm">
              Transformando vidas através do apoio a missionários comprometidos com a obra.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Plataforma</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/campaigns" className="text-gray-600 hover:text-gray-900">
                      Campanhas
                    </Link>
                  </li>
                  <li>
                    <Link href="/missionaries" className="text-gray-600 hover:text-gray-900">
                      Missionários
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-600 hover:text-gray-900">
                      Sobre
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                      Privacidade
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                      Termos
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} Mission Donate. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
