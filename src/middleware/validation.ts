import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ZodError, ZodSchema } from 'zod'
import xss from 'xss'
import { createAuditLog } from '@/lib/audit'

interface ValidationConfig {
  schema: ZodSchema
  sanitize?: boolean
}

export function validateRequest(config: ValidationConfig) {
  return async function(req: NextRequest) {
    try {
      // Obter o corpo da requisição
      const body = await req.json()

      // Sanitizar input se necessário
      const sanitizedBody = config.sanitize ? sanitizeObject(body) : body

      // Validar com schema Zod
      const validatedData = config.schema.parse(sanitizedBody)

      // Anexar dados validados à requisição
      const requestWithValidData = req.clone()
      ;(requestWithValidData as any).validatedData = validatedData

      return NextResponse.next()
    } catch (error) {
      // Log de tentativa de input inválido
      await createAuditLog('VALIDATION_ERROR', 'API', {
        details: {
          path: req.nextUrl.pathname,
          error: error instanceof ZodError ? error.errors : error,
          ip: req.ip,
        },
        level: 'warning',
        ip_address: req.ip,
        user_agent: req.headers.get('user-agent'),
      })

      // Retornar erro apropriado
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            details: error.errors,
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          error: 'Invalid Input',
        },
        { status: 400 }
      )
    }
  }
}

// Função para sanitizar strings
function sanitizeString(value: string): string {
  // Remove tags HTML maliciosos mantendo formatação básica
  const sanitized = xss(value, {
    whiteList: {
      b: [],
      i: [],
      u: [],
      p: [],
      br: [],
      strong: [],
      em: [],
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  })

  // Remove caracteres de controle
  return sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
}

// Função para sanitizar objetos recursivamente
function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item))
  }

  const sanitized: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    // Sanitiza a chave e o valor
    const sanitizedKey = sanitizeString(key)
    sanitized[sanitizedKey] = sanitizeObject(value)
  }

  return sanitized
}

// Middleware para validar headers
export function validateHeaders(req: NextRequest) {
  const contentType = req.headers.get('content-type')
  const userAgent = req.headers.get('user-agent')
  const origin = req.headers.get('origin')

  // Lista de verificações de segurança
  const checks = [
    // Verifica Content-Type para requisições com corpo
    {
      condition: req.method !== 'GET' && req.method !== 'HEAD' && !contentType?.includes('application/json'),
      error: 'Invalid Content-Type',
    },
    // Verifica User-Agent
    {
      condition: !userAgent,
      error: 'User-Agent is required',
    },
    // Verifica Origin para requisições CORS
    {
      condition: req.method !== 'GET' && origin && !isValidOrigin(origin),
      error: 'Invalid Origin',
    },
  ]

  // Encontra primeira falha
  const failedCheck = checks.find(check => check.condition)

  if (failedCheck) {
    return NextResponse.json(
      { error: failedCheck.error },
      { status: 400 }
    )
  }

  return NextResponse.next()
}

// Função para validar origem
function isValidOrigin(origin: string): boolean {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
  ]

  return allowedOrigins.includes(origin)
}

// Middleware para validar tipos de arquivos
export function validateFileUpload(allowedTypes: string[]) {
  return async function(req: NextRequest) {
    try {
      const formData = await req.formData()
      const file = formData.get('file') as File

      if (!file) {
        throw new Error('No file uploaded')
      }

      // Verifica tipo do arquivo
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not allowed')
      }

      // Verifica tamanho do arquivo (ex: 5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('File too large')
      }

      // Verifica nome do arquivo
      const fileName = file.name.toLowerCase()
      if (fileName.includes('..') || /[<>:"/\\|?*]/.test(fileName)) {
        throw new Error('Invalid file name')
      }

      return NextResponse.next()
    } catch (error) {
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : 'Upload Error',
        },
        { status: 400 }
      )
    }
  }
}
