import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('=== BASIC TEST START ===')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Request received successfully')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Basic API test working',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('=== BASIC TEST ERROR ===', error)
    return NextResponse.json({ 
      error: 'Basic test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== BASIC POST TEST START ===')
    
    const body = await request.json()
    console.log('Received POST data:', body)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Basic POST API test working',
      receivedData: body,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('=== BASIC POST TEST ERROR ===', error)
    return NextResponse.json({ 
      error: 'Basic POST test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
