import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Only check protected routes
  if (pathname.startsWith('/student-exam-portal') || pathname.startsWith('/pending-approval')) {
    try {
      const sql = neon(process.env.DATABASE_URL!)
      
      // Get session token from cookies or headers
      const sessionToken = request.cookies.get('session_token')?.value || 
                          request.headers.get('authorization')?.replace('Bearer ', '')

      if (!sessionToken) {
        // No session token, redirect to signup
        return NextResponse.redirect(new URL('/membership-signup', request.url))
      }

      // Check if user exists and is approved
      const users = await sql`
        SELECT id, is_approved, expires_at FROM membership_users 
        WHERE session_token = ${sessionToken}
      `

      if (users.length === 0) {
        // Invalid session, redirect to signup
        return NextResponse.redirect(new URL('/membership-signup', request.url))
      }

      const user = users[0]

      // Check if user is approved
      if (!user.is_approved) {
        if (pathname !== '/pending-approval') {
          // User not approved, redirect to pending page
          return NextResponse.redirect(new URL('/pending-approval', request.url))
        }
        return NextResponse.next()
      }

      // Check if access has expired
      if (new Date(user.expires_at) < new Date()) {
        // Access expired, redirect to road rules with payment info
        return NextResponse.redirect(new URL('/road-rules', request.url))
      }

      // User has valid access, allow continue
      return NextResponse.next()

    } catch (error) {
      console.error('Middleware error:', error)
      // On error, allow access (fail open)
      return NextResponse.next()
    }
  }

  // For admin routes, check if user is admin
  if (pathname.startsWith('/admin')) {
    try {
      const sql = neon(process.env.DATABASE_URL!)
      
      // Get session token from cookies or headers
      const sessionToken = request.cookies.get('session_token')?.value || 
                          request.headers.get('authorization')?.replace('Bearer ', '')

      if (!sessionToken) {
        // No session token for admin, redirect to login
        return NextResponse.redirect(new URL('/road-rules', request.url))
      }

      // Check if user exists and is admin (you might need to add an is_admin field to users table)
      const users = await sql`
        SELECT id, is_admin FROM membership_users 
        WHERE session_token = ${sessionToken}
      `

      if (users.length === 0 || !users[0].is_admin) {
        // Not an admin, redirect to road rules
        return NextResponse.redirect(new URL('/road-rules', request.url))
      }

      return NextResponse.next()

    } catch (error) {
      console.error('Admin middleware error:', error)
      // On error, allow access (fail open)
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/student-exam-portal/:path*', '/pending-approval', '/admin/:path*']
}
