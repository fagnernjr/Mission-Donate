import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DonorProfile, DonationHistory } from '@/types/donor'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils'

const preferencesFormSchema = z.object({
  preferredCategories: z.array(z.string()),
  preferredPaymentMethod: z.string(),
  anonymousDonation: z.boolean(),
  notificationPreferences: z.object({
    emailNotifications: z.boolean(),
    campaignUpdates: z.boolean(),
    monthlySummary: z.boolean(),
  }),
})

interface DonorProfileProps {
  userId: string
}

export function DonorProfile({ userId }: DonorProfileProps) {
  const [profile, setProfile] = useState<DonorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof preferencesFormSchema>>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      preferredCategories: [],
      preferredPaymentMethod: '',
      anonymousDonation: false,
      notificationPreferences: {
        emailNotifications: true,
        campaignUpdates: true,
        monthlySummary: true,
      },
    },
  })

  useEffect(() => {
    async function loadDonorProfile() {
      try {
        // TODO: Implement API call to fetch donor profile
        setLoading(false)
      } catch (error) {
        console.error('Error loading donor profile:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o perfil do doador.',
          variant: 'destructive',
        })
        setLoading(false)
      }
    }

    loadDonorProfile()
  }, [userId, toast])

  async function onSubmit(values: z.infer<typeof preferencesFormSchema>) {
    try {
      // TODO: Implement API call to update donor preferences
      toast({
        title: 'Sucesso',
        description: 'Preferências atualizadas com sucesso.',
      })
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as preferências.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <Tabs defaultValue="preferences" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="preferences">Preferências</TabsTrigger>
        <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
      </TabsList>

      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Doação</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="preferredPaymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de Pagamento Preferido</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um método de pagamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="anonymousDonation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Doação Anônima</FormLabel>
                        <FormDescription>
                          Suas doações não mostrarão seu nome publicamente
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notificationPreferences.emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Notificações por Email</FormLabel>
                        <FormDescription>
                          Receba atualizações importantes por email
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit">Salvar Preferências</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="statistics">
        <Card>
          <CardHeader>
            <CardTitle>Suas Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.statistics && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Doado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(profile.statistics.totalAmount)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Doações Realizadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {profile.statistics.totalDonations}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Campanhas Apoiadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {profile.statistics.campaignsSupported}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Doações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {profile?.donationHistory.map((donation: DonationHistory) => (
                <div
                  key={`${donation.campaignId}-${donation.createdAt}`}
                  className="flex items-center"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {donation.campaignTitle}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {donation.campaignOwnerName}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {formatCurrency(donation.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
