import { PageHeader } from '@/components/institutional/shared/PageHeader'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        title="Termos de Uso"
        description="Leia atentamente os termos e condições que regem o uso de nossa plataforma."
      />

      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introdução */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              1. Termos e Definições
            </h2>
            <p className="text-muted-foreground mb-6">
              Ao acessar e usar a plataforma Mission Donate, você
              concorda com estes termos de uso. Por favor, leia-os
              atentamente antes de usar nossos serviços.
            </p>
            <Accordion type="single" collapsible>
              <AccordionItem value="platform">
                <AccordionTrigger>Plataforma</AccordionTrigger>
                <AccordionContent>
                  A plataforma Mission Donate é um serviço online que
                  conecta doadores a missionários, facilitando doações e
                  o acompanhamento de projetos missionários.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="user">
                <AccordionTrigger>Usuário</AccordionTrigger>
                <AccordionContent>
                  Qualquer pessoa física ou jurídica que acesse ou
                  utilize nossa plataforma, seja como doador ou
                  missionário.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="content">
                <AccordionTrigger>Conteúdo</AccordionTrigger>
                <AccordionContent>
                  Todo material, incluindo textos, imagens, vídeos e
                  dados disponibilizados na plataforma.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Elegibilidade */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              2. Elegibilidade
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Para usar nossa plataforma, você deve:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Ter pelo menos 18 anos de idade</li>
                <li>
                  Ter capacidade legal para celebrar contratos
                </li>
                <li>
                  Fornecer informações verdadeiras e precisas
                </li>
                <li>
                  Concordar com nossa Política de Privacidade
                </li>
              </ul>
            </div>
          </section>

          {/* Conta de Usuário */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              3. Conta de Usuário
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">
                  3.1 Criação de Conta
                </h3>
                <p className="text-muted-foreground">
                  Ao criar uma conta, você é responsável por manter a
                  confidencialidade de suas credenciais e por todas as
                  atividades realizadas em sua conta.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  3.2 Segurança da Conta
                </h3>
                <p className="text-muted-foreground">
                  Você deve notificar imediatamente a Mission Donate
                  sobre qualquer uso não autorizado de sua conta ou
                  violação de segurança.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  3.3 Encerramento de Conta
                </h3>
                <p className="text-muted-foreground">
                  Reservamo-nos o direito de suspender ou encerrar sua
                  conta por violação destes termos ou comportamento
                  inadequado.
                </p>
              </div>
            </div>
          </section>

          {/* Doações */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Doações</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">
                  4.1 Processamento
                </h3>
                <p className="text-muted-foreground">
                  As doações são processadas por parceiros de pagamento
                  seguros. A Mission Donate não armazena dados de
                  cartão de crédito.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4.2 Taxas</h3>
                <p className="text-muted-foreground">
                  Cobramos uma taxa administrativa para manter a
                  plataforma. As taxas são claramente informadas antes
                  da conclusão da doação.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  4.3 Reembolsos
                </h3>
                <p className="text-muted-foreground">
                  Doações são geralmente não reembolsáveis. Casos
                  excepcionais serão analisados individualmente.
                </p>
              </div>
            </div>
          </section>

          {/* Responsabilidades */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              5. Responsabilidades
            </h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="platform-resp">
                <AccordionTrigger>
                  5.1 Da Plataforma
                </AccordionTrigger>
                <AccordionContent>
                  A Mission Donate é responsável por manter a
                  plataforma operacional, segura e atualizada,
                  garantindo a transparência nas transações.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="missionary-resp">
                <AccordionTrigger>
                  5.2 Dos Missionários
                </AccordionTrigger>
                <AccordionContent>
                  Missionários são responsáveis pela veracidade das
                  informações fornecidas e pelo uso adequado dos
                  recursos recebidos.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="donor-resp">
                <AccordionTrigger>
                  5.3 Dos Doadores
                </AccordionTrigger>
                <AccordionContent>
                  Doadores são responsáveis por verificar a
                  autenticidade dos projetos antes de doar e por
                  fornecer informações precisas de pagamento.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Propriedade Intelectual */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              6. Propriedade Intelectual
            </h2>
            <p className="text-muted-foreground mb-6">
              Todo o conteúdo da plataforma, incluindo logos, textos,
              imagens e software, é propriedade da Mission Donate ou
              de seus parceiros e está protegido por leis de
              propriedade intelectual.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  6.1 Uso do Conteúdo
                </h3>
                <p className="text-muted-foreground">
                  O conteúdo não pode ser copiado, modificado ou
                  distribuído sem autorização prévia.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  6.2 Conteúdo do Usuário
                </h3>
                <p className="text-muted-foreground">
                  Ao submeter conteúdo à plataforma, você concede à
                  Mission Donate uma licença não exclusiva de uso.
                </p>
              </div>
            </div>
          </section>

          {/* Limitação de Responsabilidade */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              7. Limitação de Responsabilidade
            </h2>
            <p className="text-muted-foreground mb-6">
              A Mission Donate não se responsabiliza por:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                Interrupções ou erros técnicos na plataforma
              </li>
              <li>
                Ações ou omissões de terceiros
              </li>
              <li>
                Perdas ou danos indiretos
              </li>
              <li>
                Conteúdo gerado por usuários
              </li>
            </ul>
          </section>

          {/* Alterações nos Termos */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              8. Alterações nos Termos
            </h2>
            <p className="text-muted-foreground">
              Reservamo-nos o direito de modificar estes termos a
              qualquer momento. Alterações significativas serão
              notificadas aos usuários. O uso continuado da
              plataforma após as alterações implica na aceitação dos
              novos termos.
            </p>
          </section>

          {/* Lei Aplicável */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              9. Lei Aplicável
            </h2>
            <p className="text-muted-foreground">
              Estes termos são regidos pelas leis do Brasil.
              Qualquer disputa será resolvida nos tribunais da
              comarca de São Paulo, SP.
            </p>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contato</h2>
            <p className="text-muted-foreground">
              Para questões relacionadas a estes termos, entre em
              contato através do e-mail legal@missiondonate.org ou
              pelo telefone (11) 1234-5678.
            </p>
            <p className="text-sm mt-4">
              Última atualização: 8 de dezembro de 2023
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
