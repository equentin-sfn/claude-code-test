import { NextRequest, NextResponse } from 'next/server'
import { validatePassword, setAuthCookie } from '@/lib/auth'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { getCorsHeaders, addSecurityHeaders, getClientIp } from '@/lib/security'

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request)
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request)
  const clientIp = getClientIp(request)

  // Rate limiting - strict for auth to prevent brute force
  const rateLimitResult = checkRateLimit(`auth:${clientIp}`, RATE_LIMITS.auth)

  if (!rateLimitResult.allowed) {
    const response = NextResponse.json(
      { success: false, error: 'Too many login attempts. Please wait a minute.' },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          'Retry-After': String(rateLimitResult.resetIn),
        },
      }
    )
    return addSecurityHeaders(response)
  }

  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      const response = NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400, headers: corsHeaders }
      )
      return addSecurityHeaders(response)
    }

    // Limit password length to prevent DoS via long strings
    if (password.length > 100) {
      const response = NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 400, headers: corsHeaders }
      )
      return addSecurityHeaders(response)
    }

    const isValid = await validatePassword(password)

    if (isValid) {
      await setAuthCookie()
      const response = NextResponse.json(
        { success: true },
        { headers: corsHeaders }
      )
      return addSecurityHeaders(response)
    } else {
      // Don't reveal whether password was close or not
      const response = NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401, headers: corsHeaders }
      )
      return addSecurityHeaders(response)
    }
  } catch {
    const response = NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500, headers: corsHeaders }
    )
    return addSecurityHeaders(response)
  }
}
