import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req: request, res })

  // Adiciona headers de segurança e CORS
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Responde a preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
    })
  }

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/reset-password', '/update-password']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route)
  const isAuthCallback = request.nextUrl.pathname === '/auth/callback'

  // Allow public assets and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static') ||
    isAuthCallback
  ) {
    return res
  }

  // Redirect authenticated users away from public routes
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to login
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url)
    
    // Se houver parâmetros, adicione apenas o redirectedFrom
    const redirectedFrom = request.nextUrl.searchParams.get('redirectedFrom')
    if (redirectedFrom) {
      redirectUrl.searchParams.set('redirectedFrom', redirectedFrom)
    }
    
    // Cria uma nova resposta para limpar todos os outros parâmetros
    const response = NextResponse.redirect(redirectUrl)
    
    // Limpa os cookies de parâmetros de URL se necessário
    response.cookies.delete('redirectedFrom')
    
    return response
  }

  return res
}

// Specify which routes should be protected
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
