import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Debug environment variables
    console.log('Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10))
    
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
    
    // Try the latest model first, then fallback
    let text = '';
    let modelName = '';
    
    try {
      console.log('Testing gemini-1.5-flash-latest...')
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })
      const result = await model.generateContent("Hello, respond with 'API test successful'")
      const response = await result.response
      text = response.text()
      modelName = 'gemini-1.5-flash-latest'
    } catch (error: any) {
      console.log('gemini-1.5-flash-latest failed, trying gemini-1.5-flash')
      console.log('Error:', error.message)
      
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await model.generateContent("Hello, respond with 'API test successful'")
        const response = await result.response
        text = response.text()
        modelName = 'gemini-1.5-flash'
      } catch (fallbackError: any) {
        console.log('Both models failed:', fallbackError.message)
        
        return NextResponse.json({ 
          success: false, 
          error: `Both Gemini models failed. Latest: ${error.message}, Fallback: ${fallbackError.message}`,
          details: { latestError: error.stack, fallbackError: fallbackError.stack }
        }, { status: 500 })
      }
    }
    
    console.log(`Model ${modelName} works! Response:`, text)
    
    return NextResponse.json({ 
      success: true, 
      message: `Gemini API is working with model: ${modelName}`,
      response: text,
      workingModel: modelName
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
