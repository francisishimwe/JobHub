import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Rate limiting storage
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

/**
 * Middleware to protect API routes
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: { maxRequests?: number; windowMs?: number } = {}
) {
  const { maxRequests = 100, windowMs = 60000 } = options // Default: 100 requests per minute

  return async (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()

    // Clean up expired entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key)
      }
    }

    const rateLimit = rateLimitMap.get(ip)

    if (!rateLimit || now > rateLimit.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    } else {
      rateLimit.count++
      if (rateLimit.count > maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return handler(req)
  }
}

/**
 * Verify cron secret for scheduled jobs
 */
export function verifyCronSecret(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.warn('CRON_SECRET not set in environment variables')
    return false
  }

  return authHeader === `Bearer ${cronSecret}`
}

/**
 * Validate request origin
 */
export function isValidOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ].filter(Boolean)

  if (!origin) return true // Same-origin requests don't have origin header

  return allowedOrigins.some(allowed => origin.startsWith(allowed || ''))
}
