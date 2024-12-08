import { PageHeader } from '@/components/institutional/shared/PageHeader'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageHeader
        title="Política de Privacidade"
        description="Entenda como coletamos, usamos e protegemos seus dados pessoais."
      />

      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introdução */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Introdução</h2>
            <p className="text-muted-foreground">
              A Mission Donate está comprometida com a proteção de sua
              privacidade. Esta Política de Privacidade explica como
              coletamos, usamos, divulgamos e protegemos suas informações
              pessoais quando você utiliza nossa plataforma.
            </p>
          </section>

          {/* Informações que Coletamos */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              Informações que Coletamos
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">
                    Informações Fornecidas
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Nome completo</li>
                    <li>• Endereço de e-mail</li>
                    <li>• Número de telefone</li>
                    <li>• Endereço para correspondência</li>
                    <li>• Informações de pagamento</li>
                    <li>• Documentos de identificação</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">
                    Informações Coletadas Automaticamente
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Endereço IP</li>
                    <li>• Tipo de navegador</li>
                    <li>• Sistema operacional</li>
                    <li>• Páginas visitadas</li>
                    <li>• Tempo de permanência</li>
                    <li>• Dados de localização</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Como Usamos suas Informações */}
          <section>
            <h2 className="text-2xl font-bold mb-6">
              Como Usamos suas Informações
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Processamento de Doações
                </AccordionTrigger>
                <AccordionContent>
                  Utilizamos suas informações para processar doações,
                  emitir recibos e manter registros financeiros precisos.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Comunicação
                </AccordionTrigger>
                <AccordionContent>
                  Enviamos atualizações sobre projetos, newsletters e
                  comunicações importantes sobre sua conta e doações.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Melhorias na Plataforma
                </AccordionTrigger>
                <AccordionContent>
                  Analisamos dados de uso para melhorar nossa plataforma
                  e oferecer uma melhor experiência aos usuários.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Segurança
                </AccordionTrigger>
                <AccordionContent>
                  Monitoramos atividades para prevenir fraudes e proteger
                  nossa plataforma e usuários.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Compartilhamento de Informações */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Compartilhamento de Informações
            </h2>
            <p className="text-muted-foreground mb-6">
              Compartilhamos suas informações apenas quando necessário
              para:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  Processadores de Pagamento
                </h3>
                <p className="text-sm text-muted-foreground">
                  Compartilhamos dados necessários para processar
                  transações com nossos parceiros de pagamento.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Requisitos Legais
                </h3>
                <p className="text-sm text-muted-foreground">
                  Podemos divulgar informações quando exigido por lei ou
                  para proteger direitos legais.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Missionários e Organizações
                </h3>
                <p className="text-sm text-muted-foreground">
                  Compartilhamos informações necessárias com
                  missionários e organizações para facilitar as doações.
                </p>
              </div>
            </div>
          </section>

          {/* Seus Direitos */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Seus Direitos</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">
                    Direitos do Titular
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Acesso aos dados pessoais</li>
                    <li>• Correção de dados incorretos</li>
                    <li>• Exclusão de dados</li>
                    <li>• Portabilidade dos dados</li>
                    <li>• Revogação de consentimento</li>
                    <li>• Oposição ao processamento</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Como Exercer</h3>
                  <p className="text-sm text-muted-foreground">
                    Para exercer seus direitos, entre em contato através
                    do e-mail privacy@missiondonate.org ou acesse sua
                    conta na plataforma. Responderemos sua solicitação
                    em até 15 dias úteis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Segurança */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Segurança dos Dados
            </h2>
            <p className="text-muted-foreground mb-6">
              Implementamos medidas técnicas e organizacionais
              apropriadas para proteger suas informações pessoais:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Criptografia de dados em trânsito e em repouso</li>
              <li>• Controles de acesso rigorosos</li>
              <li>• Monitoramento contínuo de segurança</li>
              <li>• Backups regulares</li>
              <li>• Treinamento de segurança para funcionários</li>
              <li>
                • Avaliações periódicas de vulnerabilidades e testes de
                penetração
              </li>
            </ul>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Contato</h2>
            <p className="text-muted-foreground">
              Se você tiver dúvidas sobre esta Política de Privacidade
              ou sobre como tratamos seus dados pessoais, entre em
              contato com nosso Encarregado de Proteção de Dados:
            </p>
            <div className="mt-4">
              <p className="text-sm">
                E-mail: privacy@missiondonate.org
                <br />
                Telefone: (11) 1234-5678
                <br />
                Endereço: Rua Example, 123 - São Paulo, SP
              </p>
            </div>
          </section>

          {/* Atualizações */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Atualizações da Política
            </h2>
            <p className="text-muted-foreground">
              Esta política pode ser atualizada periodicamente. A data
              da última atualização será sempre indicada no início do
              documento. Recomendamos que você revise esta política
              regularmente.
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
