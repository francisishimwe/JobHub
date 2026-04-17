import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  console.log('=== INTERVIEW API CALLED ===')
  
  try {
    // Debug environment variables
    console.log('Raw env check:', process.env.GEMINI_API_KEY)
    console.log('Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10))
    console.log('Env type:', typeof process.env.GEMINI_API_KEY)
    
    if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing')
}

console.log('Creating GoogleGenerativeAI instance...')
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    
    const systemInstruction = `You are the Rwanda Job Hub AI Coach. Your goal is to conduct mock interviews for Rwandan job seekers. Ask one question at a time, wait for their answer, and then provide constructive feedback using the STAR method. Focus on common employers like Bank of Kigali, MTN Rwanda, and RRA. Maintain a professional, encouraging tone.`

    console.log('Parsing request body...')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { messages, endInterview } = body
    console.log('Extracted - messages:', messages, 'endInterview:', endInterview)

    if (endInterview) {
      // Generate final performance summary
      console.log('Creating end interview model...')
      
      const conversation = messages.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')
      const prompt = `Based on this interview conversation, provide a detailed performance summary:\n\n${conversation}\n\nPlease include:\n1. Overall performance rating\n2. Specific strengths demonstrated\n3. Areas for improvement\n4. Recommendations for future interviews\n5. Encouraging closing remarks`
      
      console.log('End interview prompt:', prompt)
      
      // Try the latest model first, then fallback
      let summary = '';
      let modelUsed = '';
      
      try {
        console.log('Trying gemini-1.5-flash with stable v1 API...')
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash"
        }, { apiVersion: 'v1' })
        
        // Prepend system instruction to prompt
        const promptWithInstruction = `System: You are the Rwanda Job Hub AI Coach. Assist Rwandan job seekers using the STAR method. Provide a comprehensive performance summary of the interview, highlighting strengths and areas for improvement.

User: ${prompt}`
        
        console.log('Calling Gemini API for summary with gemini-1.5-flash model...')
        const result = await model.generateContent(promptWithInstruction)
        console.log('Got result from Gemini')
        const response = await result.response
        console.log('Got response from result')
        summary = response.text()
        modelUsed = 'gemini-1.5-flash'
      } catch (error: any) {
        console.log('gemini-1.5-flash failed, no fallback available')
        console.log('Error:', error.message)
        throw error
      }

      console.log('Generated summary with model:', modelUsed)
      console.log('Summary:', summary)

      return NextResponse.json({ 
        success: true, 
        message: summary,
        isEndSummary: true,
        modelUsed: modelUsed
      })
    }

    console.log('Creating regular interview flow...')

    // Format conversation history
    let conversationHistory = ''
    if (messages && messages.length > 0) {
      conversationHistory = messages.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')
    }

    let prompt = ''
    if (messages.length === 0) {
      // First message - start the interview
      prompt = "Start a mock interview for a Rwandan job seeker. Begin with a warm welcome and ask the first common interview question. Focus on roles at major Rwandan companies like Bank of Kigali, MTN Rwanda, or RRA."
      console.log('Starting new interview')
    } else {
      // Continue the conversation
      prompt = `Continue the mock interview based on this conversation:\n\n${conversationHistory}\n\nProvide feedback on their last answer using the STAR method (Situation, Task, Action, Result), then ask the next relevant interview question.`
      console.log('Continuing interview with history')
    }

    console.log('Generated prompt:', prompt)
    
    // Try the latest model first, then fallback
    let aiResponse = '';
    let modelUsed = '';
    
    try {
      console.log('Trying gemini-1.5-flash with stable v1 API...')
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash"
      }, { apiVersion: 'v1' })
      
      // Prepend system instruction to prompt
      const promptWithInstruction = `System: You are the Rwanda Job Hub AI Coach. Assist Rwandan job seekers using the STAR method.

User: ${prompt}`
      
      console.log('Calling Gemini API with gemini-1.5-flash model...')
      const result = await model.generateContent(promptWithInstruction)
      console.log('Got result from Gemini')
      const response = await result.response
      console.log('Got response from result')
      aiResponse = response.text()
      modelUsed = 'gemini-1.5-flash'
    } catch (error: any) {
      console.log('gemini-1.5-flash failed, no fallback available')
      console.log('Error:', error.message)
      throw error
    }

    console.log('Generated response with model:', modelUsed)
    console.log('Gemini response:', aiResponse)

    return NextResponse.json({ 
      success: true, 
      message: aiResponse,
      modelUsed: modelUsed
    })

  } catch (error) {
    console.error('=== CATCH BLOCK TRIGGERED ===')
    console.error('Interview API Error:', error)
    console.error('Error type:', typeof error)
    console.error('Error constructor:', error?.constructor?.name)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Return exact error message as requested
    const errorMessage = error instanceof Error ? error.message : 'Failed to process interview request'
    console.error('Returning error message:', errorMessage)
    
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
