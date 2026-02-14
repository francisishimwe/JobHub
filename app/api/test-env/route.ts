import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    resendApiKey: process.env.RESEND_API_KEY ? "✅ Loaded" : "❌ Missing",
    apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
    nodeEnv: process.env.NODE_ENV
  })
}
