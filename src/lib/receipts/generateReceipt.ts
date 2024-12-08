import PDFDocument from 'pdfkit'
import { Buffer } from 'buffer'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils/format'

type ReceiptData = {
  donationId: string
  campaignTitle: string
  donorName: string
  donorEmail: string
  amount: number
  paymentMethod: 'card' | 'pix'
  paymentDate: Date
  receiptNumber: string
}

export async function generateReceipt({
  donationId,
  campaignTitle,
  donorName,
  donorEmail,
  amount,
  paymentMethod,
  paymentDate,
  receiptNumber
}: ReceiptData): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  })

  // Criar um buffer para armazenar o PDF
  const chunks: Buffer[] = []
  doc.on('data', (chunk) => chunks.push(chunk))
  
  // Promise para aguardar a finalização do PDF
  const pdfBuffer = new Promise<Buffer>((resolve) => {
    doc.on('end', () => {
      const result = Buffer.concat(chunks)
      resolve(result)
    })
  })

  // Cabeçalho
  doc
    .fontSize(20)
    .text('Recibo de Doação', { align: 'center' })
    .moveDown()

  // Número do recibo
  doc
    .fontSize(12)
    .text(`Recibo Nº: ${receiptNumber}`, { align: 'right' })
    .moveDown()

  // Informações da doação
  doc
    .fontSize(12)
    .text('Informações da Doação:', { underline: true })
    .moveDown(0.5)
    .text(`Campanha: ${campaignTitle}`)
    .text(`Doador: ${donorName}`)
    .text(`Email: ${donorEmail}`)
    .text(`Valor: ${formatCurrency(amount)}`)
    .text(`Método de Pagamento: ${paymentMethod === 'card' ? 'Cartão de Crédito' : 'PIX'}`)
    .text(`Data do Pagamento: ${paymentDate.toLocaleDateString()}`)
    .moveDown()

  // Mensagem de agradecimento
  doc
    .moveDown()
    .fontSize(12)
    .text('Agradecemos sua generosa contribuição!', { align: 'center' })
    .moveDown(0.5)
    .text('Este documento serve como comprovante de sua doação.', { align: 'center', size: 10 })

  // Informações legais
  doc
    .moveDown(2)
    .fontSize(8)
    .text('Este recibo é um documento digital gerado automaticamente.', { align: 'center' })
    .text('Para verificar a autenticidade, acesse nosso site.', { align: 'center' })

  // Finalizar o documento
  doc.end()

  // Aguardar a geração completa do PDF
  const pdfContent = await pdfBuffer

  // Salvar no Supabase Storage
  const supabase = createClient()
  const fileName = `receipts/${donationId}/${receiptNumber}.pdf`
  
  const { error: uploadError } = await supabase
    .storage
    .from('donations')
    .upload(fileName, pdfContent, {
      contentType: 'application/pdf',
      cacheControl: '3600'
    })

  if (uploadError) {
    throw new Error(`Erro ao salvar recibo: ${uploadError.message}`)
  }

  // Obter URL pública do recibo
  const { data: { publicUrl } } = supabase
    .storage
    .from('donations')
    .getPublicUrl(fileName)

  // Atualizar a URL do recibo na doação
  const { error: updateError } = await supabase
    .from('donations')
    .update({ receipt_url: publicUrl })
    .eq('id', donationId)

  if (updateError) {
    throw new Error(`Erro ao atualizar URL do recibo: ${updateError.message}`)
  }

  return pdfContent
}
