import { CampaignForm } from '@/components/campaigns/CampaignForm'
import { RouteGuard } from '@/components/auth/RouteGuard'

export default function NewCampaignPage() {
  return (
    <RouteGuard allowedRoles={['missionary']}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Nova Campanha</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <CampaignForm />
          </div>
        </main>
      </div>
    </RouteGuard>
  )
}
