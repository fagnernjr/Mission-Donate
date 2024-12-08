import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Calendar, Target, Users, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Mission } from '@/types/mission'
import { formatCurrency, formatDate } from '@/lib/utils'

// Componente para exibir as estatísticas da missão
function MissionStats({ mission }: { mission: Mission }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Doadores
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mission.statistics.totalDonors}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Média por Doação
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(mission.statistics.averageDonation)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Velocidade de Doações
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {mission.statistics.donationVelocity.toFixed(1)}/dia
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para exibir a galeria de mídia
function MediaGallery({ media }: { media: Mission['mediaGallery'] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {media.map((item) => (
        <div key={item.id} className="relative aspect-video overflow-hidden rounded-lg">
          {item.type === 'image' ? (
            <Image
              src={item.url}
              alt={item.title || ''}
              fill
              className="object-cover"
            />
          ) : (
            <video
              src={item.url}
              controls
              className="h-full w-full"
              poster={item.title}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// Componente para exibir os depoimentos
function Testimonials({ testimonials }: { testimonials: Mission['testimonials'] }) {
  return (
    <div className="space-y-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id}>
          <CardContent className="pt-6">
            <p className="mb-4 italic">{testimonial.content}</p>
            <div className="flex items-center justify-between">
              <span className="font-medium">{testimonial.author}</span>
              <span className="text-sm text-muted-foreground">
                {formatDate(testimonial.date)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Componente para o formulário de doação
function DonationForm({ mission }: { mission: Mission }) {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('credit_card')

  const handleDonate = async () => {
    // TODO: Implementar integração com gateway de pagamento
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Valor da Doação</Label>
        <div className="flex gap-2">
          {[50, 100, 200, 500].map((value) => (
            <Button
              key={value}
              variant={amount === String(value) ? 'default' : 'outline'}
              onClick={() => setAmount(String(value))}
            >
              R$ {value}
            </Button>
          ))}
        </div>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Outro valor"
        />
      </div>

      <div className="space-y-2">
        <Label>Método de Pagamento</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit_card" id="credit_card" />
            <Label htmlFor="credit_card">Cartão de Crédito</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pix" id="pix" />
            <Label htmlFor="pix">PIX</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bank_transfer" id="bank_transfer" />
            <Label htmlFor="bank_transfer">Transferência Bancária</Label>
          </div>
        </RadioGroup>
      </div>

      <Button className="w-full" size="lg" onClick={handleDonate}>
        Doar {amount && `R$ ${amount}`}
      </Button>
    </div>
  )
}

interface MissionDetailsProps {
  mission: Mission
}

export function MissionDetails({ mission }: MissionDetailsProps) {
  const progress = (mission.currentAmount / mission.goalAmount) * 100

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{mission.title}</h1>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  {mission.missionType}
                </Badge>
                <Badge
                  variant={
                    mission.urgency === 'emergencial'
                      ? 'destructive'
                      : mission.urgency === 'alta'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {mission.urgency}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  {mission.location.city}, {mission.location.state}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(mission.currentAmount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    arrecadados de {formatCurrency(mission.goalAmount)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {mission.statistics.estimatedCompletionDays}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    dias restantes
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger value="about">Sobre</TabsTrigger>
                <TabsTrigger value="updates">Atualizações</TabsTrigger>
                <TabsTrigger value="media">Galeria</TabsTrigger>
                <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Descrição</h2>
                  <p className="whitespace-pre-wrap">{mission.detailedDescription}</p>
                </div>

                <div>
                  <h2 className="mb-4 text-xl font-semibold">Objetivos</h2>
                  <div className="space-y-4">
                    {mission.goals.map((goal) => (
                      <Card key={goal.id}>
                        <CardContent className="pt-6">
                          <h3 className="mb-2 font-semibold">{goal.title}</h3>
                          <p className="mb-4 text-sm text-muted-foreground">
                            {goal.description}
                          </p>
                          <Progress
                            value={(goal.currentAmount / goal.targetAmount) * 100}
                            className="h-2"
                          />
                          <div className="mt-2 flex justify-between text-sm">
                            <span>{formatCurrency(goal.currentAmount)}</span>
                            <span className="text-muted-foreground">
                              {formatCurrency(goal.targetAmount)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <MissionStats mission={mission} />
              </TabsContent>

              <TabsContent value="updates">
                <div className="space-y-6">
                  {mission.updates.map((update) => (
                    <Card key={update.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{update.title}</CardTitle>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(update.date)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap">{update.content}</p>
                        {update.media && update.media.length > 0 && (
                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            {update.media.map((media, index) => (
                              <div
                                key={index}
                                className="relative aspect-video overflow-hidden rounded-lg"
                              >
                                {media.type === 'image' ? (
                                  <Image
                                    src={media.url}
                                    alt=""
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <video
                                    src={media.url}
                                    controls
                                    className="h-full w-full"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="media">
                <MediaGallery media={mission.mediaGallery} />
              </TabsContent>

              <TabsContent value="testimonials">
                <Testimonials testimonials={mission.testimonials} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Fazer uma Doação</CardTitle>
            </CardHeader>
            <CardContent>
              <DonationForm mission={mission} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
