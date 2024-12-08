import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminFinancialReport, CampaignFinancials } from '@/types/financial'
import { formatCurrency, formatPercentage } from '@/lib/utils'

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea']

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

function MetricCard({ title, value, description, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend && (
          <span
            className={`flex items-center text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDownRight className="mr-1 h-4 w-4" />
            )}
            {formatPercentage(trend.value)}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

interface TopCampaignsTableProps {
  campaigns: CampaignFinancials[]
}

function TopCampaignsTable({ campaigns }: TopCampaignsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campanha</TableHead>
          <TableHead>Arrecadação</TableHead>
          <TableHead>Meta</TableHead>
          <TableHead>Progresso</TableHead>
          <TableHead className="text-right">Doadores</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.campaignId}>
            <TableCell className="font-medium">
              {campaign.campaignTitle}
            </TableCell>
            <TableCell>{formatCurrency(campaign.totalRaised)}</TableCell>
            <TableCell>{formatCurrency(campaign.goalAmount)}</TableCell>
            <TableCell>{formatPercentage(campaign.progress)}</TableCell>
            <TableCell className="text-right">{campaign.donorsCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

interface AdminFinancialDashboardProps {
  report: AdminFinancialReport
  revenueData: Array<{
    month: string
    revenue: number
    transactions: number
  }>
}

export function AdminFinancialDashboard({
  report,
  revenueData,
}: AdminFinancialDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Volume Total"
          value={formatCurrency(report.totalVolume)}
          description={`${report.totalTransactions} transações`}
          trend={{ value: report.monthlyGrowth, isPositive: report.monthlyGrowth > 0 }}
        />
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(report.averageTicket)}
        />
        <MetricCard
          title="Taxa de Sucesso"
          value={formatPercentage(report.successRate)}
        />
        <MetricCard
          title="Campanhas Ativas"
          value={report.activeCampaigns}
        />
      </div>

      {/* Gráficos e Tabelas */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="regions">Regiões</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Receita Mensal</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: number, name: string) =>
                      name === 'revenue'
                        ? formatCurrency(value)
                        : value.toLocaleString()
                    }
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={2}
                    name="Receita"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="transactions"
                    stroke="#16a34a"
                    strokeWidth={2}
                    name="Transações"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Região</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={report.revenueByRegion}
                      dataKey="amount"
                      nameKey="region"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                        index,
                      }) => {
                        const RADIAN = Math.PI / 180
                        const radius = 25 + innerRadius + (outerRadius - innerRadius)
                        const x = cx + radius * Math.cos(-midAngle * RADIAN)
                        const y = cy + radius * Math.sin(-midAngle * RADIAN)

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#888888"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                          >
                            {report.revenueByRegion[index].region} (
                            {formatPercentage(
                              report.revenueByRegion[index].percentage
                            )}
                            )
                          </text>
                        )
                      }}
                    >
                      {report.revenueByRegion.map((entry, index) => (
                        <Cell
                          key={entry.region}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxas da Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total em Taxas
                      </span>
                      <span className="text-xl font-bold">
                        {formatCurrency(report.platformFees)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${(report.platformFees / report.totalVolume) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Detalhamento</h4>
                    <div className="grid gap-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Taxa de Processamento
                        </span>
                        <span>{formatCurrency(report.platformFees * 0.7)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Taxa da Plataforma
                        </span>
                        <span>{formatCurrency(report.platformFees * 0.3)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Top Campanhas</CardTitle>
            </CardHeader>
            <CardContent>
              <TopCampaignsTable campaigns={report.topCampaigns} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Região</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.revenueByRegion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="amount" fill="#2563eb">
                      {report.revenueByRegion.map((entry, index) => (
                        <Cell
                          key={entry.region}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
