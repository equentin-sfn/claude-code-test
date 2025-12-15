import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = 'spiracle-auth'

// Basic token format check (timestamp:signature)
// Full cryptographic verification happens in API routes
function hasValidTokenFormat(token: string): boolean {
  const parts = token.split(':')
  if (parts.length !== 2) return false

  const [timestamp, signature] = parts
  const timestampNum = parseInt(timestamp, 10)

  // Check timestamp is a valid number and not too old (24 hours)
  if (isNaN(timestampNum)) return false

  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours in ms
  if (now - timestampNum > maxAge) return false

  // Check signature looks valid (16 hex chars)
  if (!/^[a-f0-9]{16}$/i.test(signature)) return false

  return true
}

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)
  const hasAuth = authCookie?.value && hasValidTokenFormat(authCookie.value)
  const isLoginPage = request.nextUrl.pathname === '/'
  const isChatPage = request.nextUrl.pathname.startsWith('/chat')

  // If trying to access chat without auth, redirect to login
  if (isChatPage && !hasAuth) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If already authenticated and on login page, redirect to chat
  if (isLoginPage && hasAuth) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/chat/:path*'],
}
