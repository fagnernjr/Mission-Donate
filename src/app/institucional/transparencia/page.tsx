import { Download } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PageHeader } from '@/components/institutional/shared/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Report, Metric } from '@/types/institutional'

const metrics: Metric[] = [
  {
    label: 'Total Arrecadado',
    value: 'R$ 1.500.000',
    description: 'Desde o início da plataforma',
    trend: {
      value: 15,
      isPositive: true,
    },
  },
  {
    label: 'Projetos Apoiados',
    value: '250',
    description: 'Missões ativas e concluídas',
    trend: {
      value: 25,
      isPositive: true,
    },
  },
  {
    label: 'Taxa de Sucesso',
    value: '92%',
    description: 'Projetos que atingiram a meta',
    trend: {
      value: 5,
      isPositive: true,
    },
  },
  {
    label: 'Doadores Ativos',
    value: '5.000+',
    description: 'Comunidade engajada',
    trend: {
      value: 30,
      isPositive: true,
    },
  },
]

const reports: Report[] = [
  {
    id: '1',
    title: 'Relatório Financeiro Q4 2023',
    description: 'Demonstrativo financeiro do último trimestre de 2023',
    year: 2023,
    quarter: 4,
    type: 'financial',
    fileUrl: '/reports/financial-2023-q4.pdf',
    thumbnailUrl: '/reports/thumbnails/financial-2023-q4.jpg',
    publishedAt: new Date('2024-01-15'),
  },
  // Adicione mais relatórios aqui
]

export default function TransparencyPage() {
  return (
    <div>
      <PageHeader
        title="Transparência"
        description="Acreditamos que a transparência é fundamental para construir confiança. Aqui você encontra todos os dados sobre nossa operação."
      />

      {/* Seção Métricas */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.label}
                  </CardTitle>
                  {metric.trend && (
                    <span
                      className={`text-sm ${
                        metric.trend.isPositive
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {metric.trend.isPositive ? '+' : '-'}
                      {metric.trend.value}%
                    </span>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  {metric.description && (
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Relatórios */}
      <section className="py-12 bg-muted">
        <div className="container">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Relatórios
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Acesse nossos relatórios detalhados e acompanhe nossa
                  performance.
                </p>
              </div>
              <div className="flex gap-4">
                <Select defaultValue="2023">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="financial">
              <TabsList>
                <TabsTrigger value="financial">Financeiros</TabsTrigger>
                <TabsTrigger value="impact">Impacto</TabsTrigger>
                <TabsTrigger value="annual">Anuais</TabsTrigger>
              </TabsList>

              <TabsContent value="financial" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reports
                    .filter((report) => report.type === 'financial')
                    .map((report) => (
                      <Card key={report.id}>
                        <CardHeader>
                          {report.thumbnailUrl && (
                            <div className="relative h-40 -mt-6 -mx-6">
                              <img
                                src={report.thumbnailUrl}
                                alt={report.title}
                                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                              />
                            </div>
                          )}
                          <CardTitle className="text-lg">
                            {report.title}
                          </CardTitle>
                          <CardDescription>
                            Publicado em{' '}
                            {format(report.publishedAt, "dd 'de' MMMM", {
                              locale: ptBR,
                            })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {report.description}
                          </p>
                          <Button className="w-full" asChild>
                            <a
                              href={report.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Baixar Relatório
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="impact" className="mt-6">
                {/* Similar ao conteúdo financeiro, mas para relatórios de impacto */}
              </TabsContent>

              <TabsContent value="annual" className="mt-6">
                {/* Similar ao conteúdo financeiro, mas para relatórios anuais */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Seção Governança */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight">
              Governança e Compliance
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Nossa estrutura de governança é projetada para garantir a
              máxima transparência e eficiência na gestão dos recursos.
              Seguimos rigorosos padrões de compliance e prestação de
              contas.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold">
                  Conselho Administrativo
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Nosso conselho é composto por profissionais experientes
                  que supervisionam todas as operações e garantem a
                  aderência à nossa missão.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Auditoria Externa
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Realizamos auditorias externas anuais para garantir a
                  precisão de nossas demonstrações financeiras e
                  operacionais.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Política Anticorrupção
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Mantemos uma política rigorosa de combate à corrupção e
                  promovemos práticas éticas em todas as nossas
                  operações.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
