import { describe, expect, it } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { donationSchema, campaignSchema } from '@/lib/validations/schema'
import { sanitizeInput, sanitizeHtml } from '@/lib/validations/schema'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

describe('Authentication Security Tests', () => {
  it('should prevent brute force attacks', async () => {
    const attempts = []
    for (let i = 0; i < 11; i++) {
      const attempt = supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrong_password',
      })
      attempts.push(attempt)
    }

    const results = await Promise.all(attempts)
    const lastResult = results[results.length - 1]

    expect(lastResult.error?.message).toContain('Too many requests')
  })

  it('should prevent authentication bypass', async () => {
    const result = await supabase.auth.getSession()
    expect(result.data.session).toBeNull()

    const protectedEndpoint = await fetch('/api/protected')
    expect(protectedEndpoint.status).toBe(401)
  })
})

describe('SQL Injection Prevention Tests', () => {
  it('should prevent SQL injection in queries', async () => {
    const maliciousId = "1; DROP TABLE users; --"
    const { error } = await supabase
      .from('campaigns')
      .select()
      .eq('id', maliciousId)

    expect(error?.message).toContain('invalid input syntax')
  })

  it('should prevent SQL injection in filters', async () => {
    const maliciousFilter = "title='); DROP TABLE users; --"
    const { error } = await supabase
      .from('campaigns')
      .select()
      .filter('title', 'eq', maliciousFilter)

    expect(error).toBeTruthy()
  })
})

describe('XSS Prevention Tests', () => {
  it('should sanitize HTML input', () => {
    const maliciousInput = '<script>alert("XSS")</script><img src="x" onerror="alert(1)">'
    const sanitized = sanitizeHtml(maliciousInput)

    expect(sanitized).not.toContain('<script>')
    expect(sanitized).not.toContain('onerror')
    expect(sanitized).not.toContain('javascript:')
  })

  it('should sanitize text input', () => {
    const maliciousInput = '"><script>alert("XSS")</script>'
    const sanitized = sanitizeInput(maliciousInput)

    expect(sanitized).not.toContain('<script>')
    expect(sanitized).not.toContain('>')
    expect(sanitized).not.toContain('"')
  })
})

describe('CSRF Prevention Tests', () => {
  it('should include CSRF token in forms', async () => {
    const response = await fetch('/login')
    const html = await response.text()

    expect(html).toContain('csrf-token')
  })

  it('should reject requests without CSRF token', async () => {
    const response = await fetch('/api/protected', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: 'test' }),
    })

    expect(response.status).toBe(403)
  })
})

describe('Input Validation Tests', () => {
  it('should validate donation input', () => {
    const invalidDonation = {
      amount: -100,
      campaignId: 'invalid-uuid',
      paymentMethod: 'invalid',
      isRecurring: 'not-boolean',
    }

    const result = donationSchema.safeParse(invalidDonation)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toHaveLength(4)
    }
  })

  it('should validate campaign input', () => {
    const invalidCampaign = {
      title: 'a',
      description: 'too short',
      goal: -1000,
      endDate: new Date('2020-01-01'),
      image: 'not-a-url',
    }

    const result = campaignSchema.safeParse(invalidCampaign)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toHaveLength(5)
    }
  })
})

describe('Access Control Tests', () => {
  it('should prevent unauthorized campaign access', async () => {
    // Criar usuário doador
    const { data: donor } = await supabase.auth.signUp({
      email: 'donor@example.com',
      password: 'Test@123',
      options: {
        data: {
          role: 'donor',
        },
      },
    })

    // Tentar criar campanha (apenas missionários podem)
    const { error } = await supabase.from('campaigns').insert({
      title: 'Test Campaign',
      description: 'Test Description',
      goal: 1000,
    })

    expect(error?.message).toContain('policy')
  })

  it('should prevent unauthorized donation updates', async () => {
    // Criar usuário missionário
    const { data: missionary } = await supabase.auth.signUp({
      email: 'missionary@example.com',
      password: 'Test@123',
      options: {
        data: {
          role: 'missionary',
        },
      },
    })

    // Tentar atualizar doação de outro usuário
    const { error } = await supabase
      .from('donations')
      .update({ amount: 2000 })
      .eq('id', 'some-donation-id')

    expect(error?.message).toContain('policy')
  })
})

describe('Rate Limiting Tests', () => {
  it('should limit API requests', async () => {
    const requests = []
    for (let i = 0; i < 20; i++) {
      const request = fetch('/api/campaigns')
      requests.push(request)
    }

    const results = await Promise.all(requests)
    const lastResult = results[results.length - 1]

    expect(lastResult.status).toBe(429)
  })
})

describe('File Upload Security Tests', () => {
  it('should prevent malicious file uploads', async () => {
    const maliciousFile = new File(
      ['<?php echo "malicious code"; ?>'],
      'malicious.php',
      { type: 'application/x-php' }
    )

    const formData = new FormData()
    formData.append('file', maliciousFile)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('file type not allowed')
  })
})
