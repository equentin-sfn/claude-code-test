import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = 'spiracle-auth'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)
  const isAuthenticated = authCookie?.value === 'authenticated'
  const isLoginPage = request.nextUrl.pathname === '/'
  const isChatPage = request.nextUrl.pathname.startsWith('/chat')

  // If trying to access chat without auth, redirect to login
  if (isChatPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If already authenticated and on login page, redirect to chat
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/chat/:path*'],
}
