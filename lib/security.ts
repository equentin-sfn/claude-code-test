import { NextRequest, NextResponse } from 'next/server'

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://spiracle-chat.vercel.app',
  'https://spiracle-chat-quentin-ellis-projects.vercel.app',
]

// Also allow localhost in development
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000')
}

export function getCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin')

  // Only set CORS headers if origin is in allowed list
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.some(allowed =>
    origin === allowed || origin.endsWith('.vercel.app')
  )

  if (isAllowedOrigin) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // 24 hours
    }
  }

  return {}
}

export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export function getClientIp(request: NextRequest): string {
  // Check common headers for client IP (Vercel uses x-forwarded-for)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback
  return 'unknown'
}

// Input validation
export const MAX_MESSAGE_LENGTH = 4000 // Reasonable limit for chat messages
export const MAX_SESSION_ID_LENGTH = 100

export function validateMessageInput(message: unknown): { valid: boolean; error?: string } {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required' }
  }

  const trimmed = message.trim()

  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' }
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` }
  }

  return { valid: true }
}

export function validateSessionId(sessionId: unknown): { valid: boolean; error?: string } {
  if (!sessionId || typeof sessionId !== 'string') {
    return { valid: false, error: 'Session ID is required' }
  }

  if (sessionId.length > MAX_SESSION_ID_LENGTH) {
    return { valid: false, error: 'Invalid session ID' }
  }

  // Basic UUID format check (loose)
  const uuidPattern = /^[a-f0-9-]{36}$/i
  if (!uuidPattern.test(sessionId)) {
    return { valid: false, error: 'Invalid session ID format' }
  }

  return { valid: true }
}
