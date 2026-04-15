import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const systemInstruction = `You are the Rwanda Job Hub AI Coach. Your goal is to conduct mock interviews for Rwandan job seekers. Ask one question at a time, wait for their answer, and then provide constructive feedback using the STAR method. Focus on common employers like Bank of Kigali, MTN Rwanda, and RRA. Maintain a professional, encouraging tone.`

export async function POST(request: Request) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables')
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'API key not configured' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const body = await request.json()
    console.log('Request body:', body)
    
    const { messages, endInterview } = body

    if (endInterview) {
      // Generate final performance summary
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction + " Provide a comprehensive performance summary of the interview, highlighting strengths and areas for improvement."
      })
      
      const conversation = messages.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')
      const prompt = `Based on this interview conversation, provide a detailed performance summary:\n\n${conversation}\n\nPlease include:\n1. Overall performance rating\n2. Specific strengths demonstrated\n3. Areas for improvement\n4. Recommendations for future interviews\n5. Encouraging closing remarks`
      
      console.log('End interview prompt:', prompt)
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const summary = response.text()

      console.log('Generated summary:', summary)

      return new Response(JSON.stringify({ 
        success: true, 
        message: summary,
        isEndSummary: true 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
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
    console.log('Calling Gemini API...')

    const result = await model.generateContent(prompt)
    const response = await result.response
    const aiResponse = response.text()

    console.log('Gemini response:', aiResponse)

    return new Response(JSON.stringify({ 
      success: true, 
      message: aiResponse 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Interview API Error:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to process interview request',
      details: error instanceof Error ? error.stack : 'No additional details'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
