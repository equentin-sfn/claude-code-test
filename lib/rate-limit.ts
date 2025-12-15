// Simple in-memory rate limiter
// Note: In serverless environments, this is per-instance. For production at scale, use Redis.

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  })
}, 60000) // Clean every minute

interface RateLimitConfig {
  windowMs: number  // Time window in milliseconds
  maxRequests: number  // Max requests per window
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number  // Seconds until reset
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // If no entry or window expired, create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: Math.ceil(config.windowMs / 1000),
    }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(identifier, entry)

  const resetIn = Math.ceil((entry.resetTime - now) / 1000)

  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn,
    }
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn,
  }
}

// Rate limit configurations
export const RATE_LIMITS = {
  // Auth: 5 attempts per minute (protect against brute force)
  auth: {
    windowMs: 60 * 1000,
    maxRequests: 5,
  },
  // Chat: 20 messages per minute (reasonable usage)
  chat: {
    windowMs: 60 * 1000,
    maxRequests: 20,
  },
} as const
