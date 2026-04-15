import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY
    console.log('API Key check:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'MISSING')
    
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'GEMINI_API_KEY is not set in environment variables' 
      }, { status: 500 })
    }
    
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const result = await model.generateContent("Hello, can you respond with 'API test successful'?")
    const response = await result.response
    const text = response.text()
    
    console.log('Gemini API test response:', text)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Gemini API is working correctly',
      response: text
    })
    
  } catch (error) {
    console.error('Gemini API test error:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to test Gemini API',
      details: error instanceof Error ? error.stack : 'No additional details'
    }, { status: 500 })
  }
}
