import { PageHeader } from '@/components/institutional/shared/PageHeader'
import { Timeline } from '@/types/institutional'

const timeline: Timeline[] = [
  {
    year: 2020,
    title: 'Fundação',
    description:
      'Início da jornada com a visão de transformar o financiamento de missões.',
    imageUrl: '/timeline/foundation.jpg',
  },
  {
    year: 2021,
    title: 'Primeiras Parcerias',
    description:
      'Estabelecimento de parcerias estratégicas com organizações missionárias.',
    imageUrl: '/timeline/partnerships.jpg',
  },
  {
    year: 2022,
    title: 'Expansão Nacional',
    description:
      'Alcance de missionários em todas as regiões do Brasil.',
    imageUrl: '/timeline/expansion.jpg',
  },
  {
    year: 2023,
    title: 'Inovação Tecnológica',
    description:
      'Lançamento da plataforma digital com recursos avançados.',
    imageUrl: '/timeline/innovation.jpg',
  },
]

export default function MissionVisionPage() {
  return (
    <div>
      <PageHeader
        title="Missão e Visão"
        description="Nossa missão é facilitar e potencializar o trabalho missionário através da tecnologia, conectando doadores e missionários de forma transparente e eficiente."
      />

      {/* Seção Missão */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px]">
              <img
                src="/images/mission.jpg"
                alt="Nossa Missão"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Nossa Missão
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Facilitar e potencializar o trabalho missionário através da
                tecnologia, conectando doadores e missionários de forma
                transparente e eficiente. Buscamos ser a ponte que une aqueles
                que desejam contribuir com causas significativas e os que
                dedicam suas vidas ao trabalho missionário.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>
                    Conectar doadores a projetos missionários alinhados com
                    seus valores
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>
                    Garantir transparência e eficiência no uso dos recursos
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>
                    Facilitar o trabalho missionário através da tecnologia
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Visão */}
      <section className="py-24 bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Nossa Visão
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Ser a principal plataforma de conexão entre doadores e
                missionários na América Latina, reconhecida pela excelência,
                transparência e impacto social. Visualizamos um futuro onde o
                trabalho missionário é potencializado pela tecnologia e pelo
                engajamento da comunidade.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>
                    Alcance global com impacto local significativo
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>
                    Inovação constante em soluções tecnológicas
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span>
                    Comunidade engajada e transformadora
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px]">
              <img
                src="/images/vision.jpg"
                alt="Nossa Visão"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção Linha do Tempo */}
      <section className="py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">
              Nossa Jornada
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Conheça os principais marcos de nossa história e como temos
              evoluído para melhor servir nossa comunidade.
            </p>
          </div>

          <div className="mt-16 relative">
            <div className="absolute left-1/2 h-full w-px bg-border -translate-x-1/2" />
            <div className="space-y-16">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className="w-1/2 flex flex-col items-end">
                    <div
                      className={`max-w-xl ${
                        index % 2 === 0 ? 'text-right' : 'text-left'
                      }`}
                    >
                      <span className="text-primary font-bold">
                        {item.year}
                      </span>
                      <h3 className="mt-2 text-xl font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full" />
                  <div className="w-1/2">
                    {item.imageUrl && (
                      <div className="relative h-48 w-full">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
