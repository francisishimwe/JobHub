import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    console.log("Testing database connection...")
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL)
    console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length || 0)
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL environment variable is not set",
        envVars: Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('NEON'))
      })
    }

    const sql = neon(process.env.DATABASE_URL)
    
    // Test simple query
    const result = await sql`SELECT NOW()`
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: result[0],
      dbUrlPrefix: process.env.DATABASE_URL.substring(0, 20) + "..."
    })
  } catch (error: any) {
    console.error("Database connection test failed:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
