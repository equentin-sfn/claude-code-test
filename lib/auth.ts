import { cookies } from 'next/headers'
import { createHmac } from 'crypto'

const AUTH_COOKIE_NAME = 'spiracle-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

// Generate a signed token using DEMO_PASSWORD as the secret
function generateAuthToken(): string {
  const secret = process.env.DEMO_PASSWORD || 'fallback-secret'
  const timestamp = Date.now().toString()
  const signature = createHmac('sha256', secret)
    .update(`authenticated:${timestamp}`)
    .digest('hex')
    .slice(0, 16) // Use first 16 chars for brevity

  return `${timestamp}:${signature}`
}

// Verify the auth token is valid and not expired
function verifyAuthToken(token: string): boolean {
  const secret = process.env.DEMO_PASSWORD || 'fallback-secret'

  const parts = token.split(':')
  if (parts.length !== 2) return false

  const [timestamp, signature] = parts
  const timestampNum = parseInt(timestamp, 10)

  // Check if token is expired (24 hours)
  const now = Date.now()
  const maxAge = COOKIE_MAX_AGE * 1000 // Convert to milliseconds
  if (now - timestampNum > maxAge) return false

  // Verify signature
  const expectedSignature = createHmac('sha256', secret)
    .update(`authenticated:${timestamp}`)
    .digest('hex')
    .slice(0, 16)

  // Timing-safe comparison to prevent timing attacks
  if (signature.length !== expectedSignature.length) return false

  let result = 0
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i)
  }

  return result === 0
}

export async function validatePassword(password: string): Promise<boolean> {
  const correctPassword = process.env.DEMO_PASSWORD
  if (!correctPassword) {
    console.error('DEMO_PASSWORD environment variable not set')
    return false
  }

  // Timing-safe comparison to prevent timing attacks
  if (password.length !== correctPassword.length) return false

  let result = 0
  for (let i = 0; i < password.length; i++) {
    result |= password.charCodeAt(i) ^ correctPassword.charCodeAt(i)
  }

  return result === 0
}

export async function setAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  const token = generateAuthToken()

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Upgraded from 'lax' for better CSRF protection
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

  if (!authCookie?.value) return false

  return verifyAuthToken(authCookie.value)
}
