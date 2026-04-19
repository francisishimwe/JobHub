import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL
    
    return NextResponse.json({
      success: true,
      env: {
        DATABASE_URL: dbUrl ? 'Set' : 'Not set',
        URL_LENGTH: dbUrl ? dbUrl.length : 0,
        URL_PREFIX: dbUrl ? dbUrl.substring(0, 50) + '...' : null,
        ALL_ENVS: Object.keys(process.env).filter(key => key.includes('DATABASE'))
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
