import { formatCurrency, formatDate } from '@/lib/utils/format'

type Donation = {
  id: string
  created_at: string
  amount: number
  status: string
  payment_method: 'card' | 'pix'
  donor_name?: string
  receipt_url?: string
  campaign: {
    title: string
  }
}

type DonationsListProps = {
  donations: Donation[]
}

export function DonationsList({ donations }: DonationsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Campanha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Doador
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Método
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recibo
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(new Date(donation.created_at))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {donation.campaign.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {donation.donor_name || 'Anônimo'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(donation.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {donation.payment_method === 'card' ? 'Cartão' : 'PIX'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${donation.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : donation.status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {donation.status === 'completed' ? 'Confirmado' 
                    : donation.status === 'failed' ? 'Falhou'
                    : 'Pendente'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {donation.receipt_url && (
                  <a
                    href={donation.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Download
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
