export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Sobre o Mission Donate</h1>
        
        <div className="prose prose-slate dark:prose-invert">
          <p>
            O Mission Donate é uma plataforma que conecta doadores a missionários, facilitando o
            apoio financeiro para projetos missionários em todo o mundo.
          </p>

          <h2>Nossa Missão</h2>
          <p>
            Acreditamos que cada pessoa pode fazer a diferença no mundo. Nossa missão é criar
            uma ponte entre pessoas que desejam contribuir e missionários que dedicam suas
            vidas a causas importantes.
          </p>

          <h2>Como Funciona</h2>
          <ul>
            <li>
              <strong>Para Missionários:</strong> Crie uma conta, compartilhe sua história e
              inicie campanhas para seus projetos.
            </li>
            <li>
              <strong>Para Doadores:</strong> Explore campanhas, conheça os missionários e
              contribua de forma segura e transparente.
            </li>
          </ul>

          <h2>Transparência</h2>
          <p>
            Valorizamos a transparência em todas as doações. Cada centavo doado é
            rastreado e você pode acompanhar o impacto de sua contribuição.
          </p>

          <h2>Segurança</h2>
          <p>
            Utilizamos as mais modernas tecnologias de segurança para proteger suas
            informações e transações. Todas as doações são processadas através de
            gateways de pagamento confiáveis.
          </p>

          <h2>Contato</h2>
          <p>
            Tem alguma dúvida ou sugestão? Entre em contato conosco através do email{' '}
            <a href="mailto:contato@missiondonate.com">contato@missiondonate.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
