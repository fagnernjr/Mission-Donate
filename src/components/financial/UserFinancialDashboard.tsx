import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Calendar, Download, Wallet } from 'lucide-react'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FinancialSummary,
  FinancialTransaction,
  MonthlyRevenue,
  WithdrawalRequest,
} from '@/types/financial'
import { formatCurrency, formatDate } from '@/lib/utils'

interface WithdrawalFormProps {
  onSubmit: (data: Omit<WithdrawalRequest, 'id' | 'status' | 'requestedAt'>) => void
  availableBalance: number
}

function WithdrawalForm({ onSubmit, availableBalance }: WithdrawalFormProps) {
  const [amount, setAmount] = useState('')
  const [bankAccount, setBankAccount] = useState({
    bank: '',
    agency: '',
    account: '',
    type: 'checking' as const,
    holder: '',
    document: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      userId: 'current-user', // Será preenchido com o ID do usuário atual
      amount: Number(amount),
      bankAccount,
      processedAt: undefined,
      notes: undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Valor do Saque</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Digite o valor"
          max={availableBalance}
          required
        />
        <p className="text-sm text-muted-foreground">
          Saldo disponível: {formatCurrency(availableBalance)}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Banco</Label>
        <Input
          value={bankAccount.bank}
          onChange={(e) => setBankAccount({ ...bankAccount, bank: e.target.value })}
          placeholder="Nome do banco"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Agência</Label>
          <Input
            value={bankAccount.agency}
            onChange={(e) => setBankAccount({ ...bankAccount, agency: e.target.value })}
            placeholder="Número da agência"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Conta</Label>
          <Input
            value={bankAccount.account}
            onChange={(e) => setBankAccount({ ...bankAccount, account: e.target.value })}
            placeholder="Número da conta"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tipo de Conta</Label>
        <Select
          value={bankAccount.type}
          onValueChange={(value: 'checking' | 'savings') =>
            setBankAccount({ ...bankAccount, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="checking">Conta Corrente</SelectItem>
            <SelectItem value="savings">Conta Poupança</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Titular da Conta</Label>
        <Input
          value={bankAccount.holder}
          onChange={(e) => setBankAccount({ ...bankAccount, holder: e.target.value })}
          placeholder="Nome do titular"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>CPF/CNPJ do Titular</Label>
        <Input
          value={bankAccount.document}
          onChange={(e) => setBankAccount({ ...bankAccount, document: e.target.value })}
          placeholder="CPF ou CNPJ"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Solicitar Saque
      </Button>
    </form>
  )
}

interface TransactionHistoryProps {
  transactions: FinancialTransaction[]
}

function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [period, setPeriod] = useState('30d')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="1y">Último ano</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <span
                    className={
                      transaction.type === 'donation'
                        ? 'text-green-600'
                        : transaction.type === 'withdrawal'
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }
                  >
                    {transaction.type === 'donation'
                      ? 'Doação'
                      : transaction.type === 'withdrawal'
                      ? 'Saque'
                      : 'Reembolso'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      transaction.type === 'donation'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {transaction.type === 'donation' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

interface UserFinancialDashboardProps {
  summary: FinancialSummary
  monthlyRevenue: MonthlyRevenue[]
  transactions: FinancialTransaction[]
}

export function UserFinancialDashboard({
  summary,
  monthlyRevenue,
  transactions,
}: UserFinancialDashboardProps) {
  const handleWithdrawal = async (data: Omit<WithdrawalRequest, 'id' | 'status' | 'requestedAt'>) => {
    // TODO: Implementar integração com API para solicitar saque
    console.log('Solicitação de saque:', data)
  }

  return (
    <div className="space-y-8">
      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Arrecadado
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalRaised)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.totalDonations} doações de {summary.totalDonors} apoiadores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Disponível
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.availableBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(summary.pendingBalance)} pendente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Média por Doação
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.averageDonation)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Retirado
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalWithdrawn)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Extrato */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Extrato</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Doações vs. Saques</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="donations" fill="#2563eb" name="Doações" />
                    <Bar
                      dataKey="withdrawals"
                      fill="#dc2626"
                      name="Saques"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solicitar Saque</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Realizar Saque</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Solicitar Saque</DialogTitle>
                      <DialogDescription>
                        Preencha os dados bancários para realizar o saque
                      </DialogDescription>
                    </DialogHeader>
                    <WithdrawalForm
                      onSubmit={handleWithdrawal}
                      availableBalance={summary.availableBalance}
                    />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Extrato de Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionHistory transactions={transactions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
