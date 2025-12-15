import { cookies } from 'next/headers'

const AUTH_COOKIE_NAME = 'spiracle-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

export async function validatePassword(password: string): Promise<boolean> {
  const correctPassword = process.env.DEMO_PASSWORD
  if (!correctPassword) {
    console.error('DEMO_PASSWORD environment variable not set')
    return false
  }
  return password === correctPassword
}

export async function setAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)
  return authCookie?.value === 'authenticated'
}
