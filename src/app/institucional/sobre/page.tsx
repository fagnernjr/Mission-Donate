import { Linkedin, Twitter, Instagram } from 'lucide-react'
import { PageHeader } from '@/components/institutional/shared/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TeamMember, Value, Partner } from '@/types/institutional'

const values: Value[] = [
  {
    title: 'Transparência',
    description:
      'Mantemos total transparência em nossas operações e uso de recursos.',
    icon: '🔍',
  },
  {
    title: 'Impacto',
    description:
      'Focamos em gerar impacto real e mensurável em cada projeto.',
    icon: '💫',
  },
  {
    title: 'Inovação',
    description:
      'Buscamos soluções inovadoras para maximizar o alcance das missões.',
    icon: '💡',
  },
  {
    title: 'Comunidade',
    description:
      'Construímos pontes entre doadores e missionários.',
    icon: '🤝',
  },
]

const team: TeamMember[] = [
  {
    id: '1',
    name: 'João Silva',
    role: 'CEO & Fundador',
    bio: 'Apaixonado por tecnologia e impacto social, João fundou a Mission Donate com o objetivo de revolucionar o financiamento de missões.',
    imageUrl: '/team/joao-silva.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/joaosilva',
      twitter: 'https://twitter.com/joaosilva',
    },
  },
  // Adicione mais membros da equipe aqui
]

const partners: Partner[] = [
  {
    id: '1',
    name: 'ONG Parceira',
    description: 'Parceiro estratégico em projetos sociais',
    logoUrl: '/partners/ong-parceira.png',
    websiteUrl: 'https://ongparceira.org',
  },
  // Adicione mais parceiros aqui
]

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="Sobre Nós"
        description="Conectando doadores a missionários para transformar vidas através da tecnologia e da fé."
        backgroundImage="/images/about-header.jpg"
      />

      {/* Seção Nossa História */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Nossa História
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                A Mission Donate nasceu da visão de unir tecnologia e fé para
                potencializar o trabalho missionário. Desde nossa fundação,
                temos trabalhado incansavelmente para criar uma plataforma que
                facilite a conexão entre doadores e missionários, garantindo
                transparência e eficiência em cada doação.
              </p>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Nossa jornada é marcada por histórias inspiradoras de vidas
                transformadas e comunidades impactadas através do trabalho
                conjunto de nossa rede de apoiadores e missionários.
              </p>
            </div>
            <div className="relative h-[400px]">
              <img
                src="/images/our-history.jpg"
                alt="Nossa História"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção Nossos Valores */}
      <section className="py-24 bg-muted">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">
              Nossos Valores
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Nossos valores fundamentais guiam cada decisão e ação que
              tomamos, garantindo que nosso trabalho gere impacto positivo e
              duradouro.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title}>
                <CardHeader>
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Nossa Equipe */}
      <section className="py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">
              Nossa Equipe
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Conheça as pessoas apaixonadas que trabalham todos os dias para
              tornar nossa missão possível.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="relative h-64 -mt-6 -mx-6">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <CardTitle className="mt-4">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.bio}</p>
                  <div className="mt-4 flex gap-2">
                    {member.socialLinks?.linkedin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {member.socialLinks?.twitter && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <a
                          href={member.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {member.socialLinks?.instagram && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <a
                          href={member.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Parceiros */}
      <section className="py-24 bg-muted">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">
              Nossos Parceiros
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Trabalhamos com organizações que compartilham nossa visão de
              impacto social e transformação.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {partners.map((partner) => (
              <a
                key={partner.id}
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-8 bg-background rounded-lg hover:bg-muted/50 transition-colors"
              >
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-h-12"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
