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
    
    // Verify API key is being read correctly
    const apiKey = process.env.GEMINI_API_KEY
    console.log('API Key check:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'MISSING')
    
    if (!apiKey) {
      console.log('RETURNING: API key missing error')
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set in environment variables' }, { status: 500 })
    }

    console.log('Creating GoogleGenerativeAI instance...')
    const genAI = new GoogleGenerativeAI(apiKey)
    
    const systemInstruction = `You are the Rwanda Job Hub AI Coach. Your goal is to conduct mock interviews for Rwandan job seekers. Ask one question at a time, wait for their answer, and then provide constructive feedback using the STAR method. Focus on common employers like Bank of Kigali, MTN Rwanda, and RRA. Maintain a professional, encouraging tone.`

    console.log('Parsing request body...')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { messages, endInterview } = body
    console.log('Extracted - messages:', messages, 'endInterview:', endInterview)

    if (endInterview) {
      // Generate final performance summary
      console.log('Creating end interview model...')
      let model;
      try {
        // Try the latest model first
        model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash-latest",
          systemInstruction: systemInstruction + " Provide a comprehensive performance summary of the interview, highlighting strengths and areas for improvement."
        })
      } catch (error) {
        console.log('gemini-1.5-flash-latest failed, trying gemini-1.5-flash')
        model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          systemInstruction: systemInstruction + " Provide a comprehensive performance summary of the interview, highlighting strengths and areas for improvement."
        })
      }
      
      console.log('Model created successfully')
      
      const conversation = messages.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')
      const prompt = `Based on this interview conversation, provide a detailed performance summary:\n\n${conversation}\n\nPlease include:\n1. Overall performance rating\n2. Specific strengths demonstrated\n3. Areas for improvement\n4. Recommendations for future interviews\n5. Encouraging closing remarks`
      
      console.log('End interview prompt:', prompt)
      console.log('Calling Gemini API for summary...')
      
      const result = await model.generateContent(prompt)
      console.log('Got result from Gemini')
      const response = await result.response
      console.log('Got response from result')
      const summary = response.text()

      console.log('Generated summary:', summary)

      return NextResponse.json({ 
        success: true, 
        message: summary,
        isEndSummary: true 
      })
    }

    console.log('Creating regular interview model...')
    let model;
    try {
      // Try the latest model first
      model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest",
        systemInstruction: systemInstruction
      })
    } catch (error) {
      console.log('gemini-1.5-flash-latest failed, trying gemini-1.5-flash')
      model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction
      })
    }

    console.log('Model created successfully')

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
    console.log('Calling Gemini API with model: gemini-1.5-flash...')

    const result = await model.generateContent(prompt)
    console.log('Got result from Gemini')
    const response = await result.response
    console.log('Got response from result')
    const aiResponse = response.text()

    console.log('Gemini response:', aiResponse)

    return NextResponse.json({ 
      success: true, 
      message: aiResponse 
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
