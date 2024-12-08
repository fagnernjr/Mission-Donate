import { formatCurrency } from '@/lib/utils/format'

type CampaignStatsProps = {
  totalDonations: number
  totalAmount: number
  activeSubscriptions: number
  monthlyRecurring: number
}

export function CampaignStats({
  totalDonations,
  totalAmount,
  activeSubscriptions,
  monthlyRecurring
}: CampaignStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-sm font-medium text-gray-500 truncate">
          Total de Doações
        </div>
        <div className="mt-1 text-3xl font-semibold text-gray-900">
          {totalDonations}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-sm font-medium text-gray-500 truncate">
          Valor Total Recebido
        </div>
        <div className="mt-1 text-3xl font-semibold text-gray-900">
          {formatCurrency(totalAmount)}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-sm font-medium text-gray-500 truncate">
          Assinaturas Ativas
        </div>
        <div className="mt-1 text-3xl font-semibold text-gray-900">
          {activeSubscriptions}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-sm font-medium text-gray-500 truncate">
          Receita Recorrente Mensal
        </div>
        <div className="mt-1 text-3xl font-semibold text-gray-900">
          {formatCurrency(monthlyRecurring)}
        </div>
      </div>
    </div>
  )
}
