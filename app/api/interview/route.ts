import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Verify API key is being read correctly
    const apiKey = process.env.GEMINI_API_KEY
    console.log('API Key check:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'MISSING')
    
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set in environment variables' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    const systemInstruction = `You are the Rwanda Job Hub AI Coach. Your goal is to conduct mock interviews for Rwandan job seekers. Ask one question at a time, wait for their answer, and then provide constructive feedback using the STAR method. Focus on common employers like Bank of Kigali, MTN Rwanda, and RRA. Maintain a professional, encouraging tone.`

    const body = await request.json()
    console.log('Request body:', body)
    
    const { messages, endInterview } = body

    if (endInterview) {
      // Generate final performance summary
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // Exact model name as specified
        systemInstruction: systemInstruction + " Provide a comprehensive performance summary of interview, highlighting strengths and areas for improvement."
      })
      
      const conversation = messages.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')
      const prompt = `Based on this interview conversation, provide a detailed performance summary:\n\n${conversation}\n\nPlease include:\n1. Overall performance rating\n2. Specific strengths demonstrated\n3. Areas for improvement\n4. Recommendations for future interviews\n5. Encouraging closing remarks`
      
      console.log('End interview prompt:', prompt)
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const summary = response.text()

      console.log('Generated summary:', summary)

      return NextResponse.json({ 
        success: true, 
        message: summary,
        isEndSummary: true 
      })
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Exact model name as specified
      systemInstruction: systemInstruction
    })

    // Format conversation history
    let conversationHistory = ''
    if (messages && messages.length > 0) {
      conversationHistory = messages.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')
    }

    let prompt = ''
    if (messages.length === 0) {
      // First message - start the interview
      prompt = "Start a mock interview for a Rwandan job seeker. Begin with a warm welcome and ask the first common interview question. Focus on roles at major Rwandan companies like Bank of Kigali, MTN Rwanda, or RRA."
    } else {
      // Continue the conversation
      prompt = `Continue the mock interview based on this conversation:\n\n${conversationHistory}\n\nProvide feedback on their last answer using the STAR method (Situation, Task, Action, Result), then ask the next relevant interview question.`
    }

    console.log('Generated prompt:', prompt)
    console.log('Calling Gemini API with model: gemini-1.5-flash...')

    const result = await model.generateContent(prompt)
    const response = await result.response
    const aiResponse = response.text()

    console.log('Gemini response:', aiResponse)

    return NextResponse.json({ 
      success: true, 
      message: aiResponse 
    })

  } catch (error) {
    console.error('Interview API Error:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Return exact error message as requested
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to process interview request' }, { status: 500 })
  }
}
