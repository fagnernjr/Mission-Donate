import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { formatCurrency } from '@/lib/utils/format'

Chart.register(...registerables)

type ChartData = {
  labels: string[]
  values: number[]
}

type DonationsChartProps = {
  data: ChartData
  type: 'line' | 'bar'
  title: string
}

export function DonationsChart({ data, type, title }: DonationsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destruir gráfico anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type,
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Doações',
            data: data.values,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return formatCurrency(context.parsed.y)
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatCurrency(value as number)
            }
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type, title])

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <canvas ref={chartRef} />
    </div>
  )
}
