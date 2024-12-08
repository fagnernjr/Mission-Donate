import { useState } from 'react'
import Image from 'next/image'
import { Share2, Download, Check, Copy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DonationReceipt } from '@/types/donation'
import { formatCurrency, formatDate } from '@/lib/utils'

interface DonationConfirmationProps {
  receipt: DonationReceipt
}

export function DonationConfirmation({ receipt }: DonationConfirmationProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDownloadReceipt = () => {
    // TODO: Implementar download do recibo em PDF
  }

  const handleDownloadFiscalReceipt = () => {
    // TODO: Implementar download do recibo fiscal em PDF
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/donation/share/${receipt.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Doação Realizada',
          text: `Acabei de apoiar a missão "${receipt.campaignTitle}" com ${formatCurrency(
            receipt.donationDetails.amount
          )}!`,
          url: shareUrl,
        })
      } catch (error) {
        console.error('Erro ao compartilhar:', error)
      }
    } else {
      setShowShareDialog(true)
    }
  }

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/donation/share/${receipt.id}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar link:', error)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Check className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Doação Confirmada!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resumo da Doação */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">Resumo da Doação</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Campanha:</span>
                <span>{receipt.campaignTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-semibold">
                  {formatCurrency(receipt.donationDetails.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data:</span>
                <span>{formatDate(receipt.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span>
                  {receipt.donationDetails.type === 'single'
                    ? 'Doação Única'
                    : 'Doação Recorrente'}
                </span>
              </div>
              {receipt.donationDetails.type === 'recurring' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequência:</span>
                  <span>
                    {receipt.donationDetails.recurringFrequency === 'monthly'
                      ? 'Mensal'
                      : receipt.donationDetails.recurringFrequency === 'quarterly'
                      ? 'Trimestral'
                      : 'Anual'}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método:</span>
                <span>
                  {receipt.donationDetails.paymentMethod === 'credit_card'
                    ? 'Cartão de Crédito'
                    : 'PIX'}
                </span>
              </div>
              {receipt.transactionId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID da Transação:</span>
                  <span className="font-mono">{receipt.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Comprovantes */}
          <div className="space-y-4">
            <h3 className="font-semibold">Comprovantes</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDownloadReceipt}
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar Recibo
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDownloadFiscalReceipt}
              >
                <Download className="mr-2 h-4 w-4" />
                Recibo Fiscal
              </Button>
            </div>
          </div>

          {/* Compartilhar */}
          <div className="space-y-4">
            <h3 className="font-semibold">Compartilhar</h3>
            <Button className="w-full" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar Doação
            </Button>
          </div>

          {/* Dialog de Compartilhamento */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Compartilhar Doação</DialogTitle>
                <DialogDescription>
                  Compartilhe sua doação nas redes sociais ou copie o link
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-4">
                  {/* Botões de redes sociais */}
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          window.location.href
                        )}`,
                        '_blank'
                      )
                    }}
                  >
                    <Image
                      src="/icons/facebook.svg"
                      alt="Facebook"
                      width={20}
                      height={20}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          `Acabei de apoiar a missão "${receipt.campaignTitle}" com ${formatCurrency(
                            receipt.donationDetails.amount
                          )}!`
                        )}&url=${encodeURIComponent(window.location.href)}`,
                        '_blank'
                      )
                    }}
                  >
                    <Image
                      src="/icons/twitter.svg"
                      alt="Twitter"
                      width={20}
                      height={20}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(
                          `Acabei de apoiar a missão "${receipt.campaignTitle}" com ${formatCurrency(
                            receipt.donationDetails.amount
                          )}! ${window.location.href}`
                        )}`,
                        '_blank'
                      )
                    }}
                  >
                    <Image
                      src="/icons/whatsapp.svg"
                      alt="WhatsApp"
                      width={20}
                      height={20}
                    />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={window.location.href}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
