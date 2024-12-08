'use client'

import { useAuthContext } from '@/components/providers/AuthProvider'

export default function DashboardPage() {
  const { user, signOut } = useAuthContext()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Bem-vindo, {user?.full_name}!</h2>
          <p className="text-gray-600">
            Você está logado como: {user?.role === 'missionary' ? 'Missionário' : 'Doador'}
          </p>
        </div>
      </main>
    </div>
  )
}
