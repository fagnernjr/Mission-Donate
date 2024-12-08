'use client'

import { 
  HeartHandshake, 
  Globe2, 
  Shield, 
  Users,
  CreditCard,
  LineChart
} from 'lucide-react'

const features = [
  {
    name: 'Doações Seguras',
    description: 'Todas as transações são protegidas e criptografadas, garantindo a segurança dos seus dados.',
    icon: Shield,
  },
  {
    name: 'Impacto Global',
    description: 'Apoie missionários em diferentes partes do mundo e faça parte de uma mudança global.',
    icon: Globe2,
  },
  {
    name: 'Transparência Total',
    description: 'Acompanhe exatamente como sua doação está sendo utilizada e o impacto que está gerando.',
    icon: LineChart,
  },
  {
    name: 'Comunidade Engajada',
    description: 'Faça parte de uma comunidade que compartilha dos mesmos valores e propósito.',
    icon: Users,
  },
  {
    name: 'Múltiplas Formas de Pagamento',
    description: 'Doe usando cartão de crédito, débito, PIX ou boleto bancário.',
    icon: CreditCard,
  },
  {
    name: 'Suporte Personalizado',
    description: 'Nossa equipe está sempre disponível para ajudar você em sua jornada de doação.',
    icon: HeartHandshake,
  },
]

export function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-500">
            Por que escolher nossa plataforma?
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tudo que você precisa para apoiar missões
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Nossa plataforma foi desenvolvida pensando em você e nos missionários.
            Facilitamos o processo de doação para que você possa focar no que realmente importa.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-primary-500"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
