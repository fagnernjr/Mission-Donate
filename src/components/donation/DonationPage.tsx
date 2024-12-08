import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Banknote, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { DonationDetails, DonationType, PaymentMethod, RecurringFrequency } from '@/types/donation'
import { formatCurrency } from '@/lib/utils'

interface DonationPageProps {
  campaignId: string
  campaignTitle: string
  minimumAmount?: number
}

export function DonationPage({
  campaignId,
  campaignTitle,
  minimumAmount = 10,
}: DonationPageProps) {
  const router = useRouter()
  const [donationType, setDonationType] = useState<DonationType>('single')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card')
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>('monthly')
  const [anonymous, setAnonymous] = useState(false)
  const [message, setMessage] = useState('')

  const predefinedAmounts = [50, 100, 200, 500]

  const handleSubmit = async () => {
    const donationDetails: DonationDetails = {
      campaignId,
      donorId: 'TODO', // Será preenchido com o ID do usuário logado
      amount: Number(amount),
      type: donationType,
      paymentMethod,
      anonymous,
      recurringFrequency: donationType === 'recurring' ? recurringFrequency : undefined,
      message: message.trim() || undefined,
    }

    // TODO: Implementar integração com gateway de pagamento
    // Por enquanto, apenas redireciona para a página de confirmação
    router.push(`/donation/confirm?id=${encodeURIComponent(JSON.stringify(donationDetails))}`)
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Fazer uma Doação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tipo de Doação */}
          <Tabs value={donationType} onValueChange={(v) => setDonationType(v as DonationType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Doação Única</TabsTrigger>
              <TabsTrigger value="recurring">Doação Recorrente</TabsTrigger>
            </TabsList>

            <TabsContent value="single">
              <p className="text-sm text-muted-foreground">
                Faça uma doação única para apoiar esta missão.
              </p>
            </TabsContent>

            <TabsContent value="recurring">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Apoie esta missão com doações regulares.
                </p>
                <div className="space-y-2">
                  <Label>Frequência</Label>
                  <Select
                    value={recurringFrequency}
                    onValueChange={(v) => setRecurringFrequency(v as RecurringFrequency)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Valor da Doação */}
          <div className="space-y-4">
            <Label>Valor da Doação</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {predefinedAmounts.map((value) => (
                <Button
                  key={value}
                  variant={amount === String(value) ? 'default' : 'outline'}
                  onClick={() => setAmount(String(value))}
                >
                  {formatCurrency(value)}
                </Button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Outro valor"
                min={minimumAmount}
                step="1"
              />
              <div className="absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                R$
              </div>
            </div>
            {Number(amount) < minimumAmount && (
              <p className="text-sm text-destructive">
                O valor mínimo para doação é {formatCurrency(minimumAmount)}
              </p>
            )}
          </div>

          {/* Método de Pagamento */}
          <div className="space-y-4">
            <Label>Método de Pagamento</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div>
                <RadioGroupItem
                  value="credit_card"
                  id="credit_card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="credit_card"
                  className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent"
                >
                  <div className="space-y-1">
                    <p className="font-medium">Cartão de Crédito</p>
                    <p className="text-sm text-muted-foreground">
                      Pagamento seguro via cartão
                    </p>
                  </div>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="pix"
                  id="pix"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="pix"
                  className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent"
                >
                  <div className="space-y-1">
                    <p className="font-medium">PIX</p>
                    <p className="text-sm text-muted-foreground">
                      Transferência instantânea
                    </p>
                  </div>
                  <Banknote className="h-5 w-5 text-muted-foreground" />
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Opções Adicionais */}
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="anonymous">Doação Anônima</Label>
              <Switch
                id="anonymous"
                checked={anonymous}
                onCheckedChange={setAnonymous}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem (opcional)</Label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deixe uma mensagem de apoio"
              />
            </div>
          </div>

          {/* Resumo e Botão de Confirmação */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">Campanha:</span>
                <span className="text-sm">{campaignTitle}</span>
              </div>
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-2xl font-bold">
                  {amount ? formatCurrency(Number(amount)) : 'R$ 0,00'}
                </span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={!amount || Number(amount) < minimumAmount}
              >
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
