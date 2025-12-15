import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { sendMessageToN8n } from '@/lib/n8n'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import {
  getCorsHeaders,
  addSecurityHeaders,
  getClientIp,
  validateMessageInput,
  validateSessionId,
} from '@/lib/security'

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

  // Check authentication first
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    const response = NextResponse.json(
      { error: 'Unauthorised' },
      { status: 401, headers: corsHeaders }
    )
    return addSecurityHeaders(response)
  }

  // Rate limiting by IP
  const clientIp = getClientIp(request)
  const rateLimitResult = checkRateLimit(`chat:${clientIp}`, RATE_LIMITS.chat)

  if (!rateLimitResult.allowed) {
    const response = NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          'Retry-After': String(rateLimitResult.resetIn),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimitResult.resetIn),
        },
      }
    )
    return addSecurityHeaders(response)
  }

  try {
    const body = await request.json()
    const { message, sessionId } = body

    // Validate message
    const messageValidation = validateMessageInput(message)
    if (!messageValidation.valid) {
      const response = NextResponse.json(
        { error: messageValidation.error },
        { status: 400, headers: corsHeaders }
      )
      return addSecurityHeaders(response)
    }

    // Validate session ID
    const sessionValidation = validateSessionId(sessionId)
    if (!sessionValidation.valid) {
      const response = NextResponse.json(
        { error: sessionValidation.error },
        { status: 400, headers: corsHeaders }
      )
      return addSecurityHeaders(response)
    }

    // Send to n8n
    const n8nResponse = await sendMessageToN8n(message.trim(), sessionId)

    const response = NextResponse.json(
      {
        response: n8nResponse.response,
        sessionId: n8nResponse.sessionId,
      },
      {
        headers: {
          ...corsHeaders,
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.resetIn),
        },
      }
    )
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Chat API error:', error)

    const errorMessage = error instanceof Error
      ? error.message
      : 'Something went wrong. Please try again.'

    const response = NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: corsHeaders }
    )
    return addSecurityHeaders(response)
  }
}
