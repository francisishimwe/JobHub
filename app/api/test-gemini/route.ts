import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET() {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'GEMINI_API_KEY is not set in environment variables' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('Testing Gemini API with key:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...')
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const result = await model.generateContent("Hello, can you respond with 'API test successful'?")
    const response = await result.response
    const text = response.text()
    
    console.log('Gemini API test response:', text)
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Gemini API is working correctly',
      response: text
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Gemini API test error:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to test Gemini API',
      details: error instanceof Error ? error.stack : 'No additional details'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
