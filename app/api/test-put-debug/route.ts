import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    console.log('🧪 TEST PUT endpoint called')
    
    const body = await request.json()
    console.log('🧪 Test PUT body:', body)
    
    return NextResponse.json({
      success: true,
      message: 'Test PUT endpoint working',
      received: body,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('🧪 Test PUT error:', error)
    return NextResponse.json({
      error: error.message,
      debug: 'Test PUT endpoint error'
    }, { status: 500 })
  }
}
