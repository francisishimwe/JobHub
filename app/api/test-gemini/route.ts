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
    
    // Try different model names to find the correct one
    const modelNames = ['gemini-1.5-flash', 'gemini-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-8b']
    
    for (const modelName of modelNames) {
      try {
        console.log(`Testing model: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent("Hello, respond with 'API test successful'")
        const response = await result.response
        const text = response.text()
        
        console.log(`Model ${modelName} works! Response:`, text)
        
        return NextResponse.json({ 
          success: true, 
          message: `Gemini API is working with model: ${modelName}`,
          response: text,
          workingModel: modelName
        })
      } catch (error: any) {
        console.log(`Model ${modelName} failed:`, error.message)
        continue
      }
    }
    
    // If no model works, return error
    return NextResponse.json({ 
      success: false, 
      error: 'No working Gemini model found. Tried: ' + modelNames.join(', ')
    }, { status: 500 })
    
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
