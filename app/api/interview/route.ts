import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  console.log('=== INTERVIEW API CALLED ===')
  
  try {
    const body = await request.json()
    console.log('Request body:', body)
    
    const { messages, endInterview } = body
    console.log('Extracted - messages:', messages, 'endInterview:', endInterview)

    // Fallback interview coach responses
    const getFallbackResponse = (messages: any[], endInterview?: boolean) => {
      if (endInterview) {
        return {
          role: 'assistant',
          content: "Thank you for completing this mock interview! Here's a summary of your performance:\n\n1. You've demonstrated good communication skills\n2. Consider providing more specific examples using the STAR method\n3. Practice articulating your achievements quantitatively\n4. Research the company more thoroughly for future interviews\n\nKeep practicing and you'll continue to improve. Good luck with your job search!"
        }
      }

      const questionCount = messages.filter(m => m.role === 'assistant').length
      const questions = [
        "Tell me about yourself and why you're interested in this position.",
        "What are your greatest strengths and how would they benefit our organization?",
        "Describe a challenging situation you've faced at work and how you handled it.",
        "Where do you see yourself in 5 years?",
        "Why do you want to work specifically for our organization in Rwanda?",
        "What questions do you have for us about this role or our company?"
      ]

      if (questionCount < questions.length) {
        return {
          role: 'assistant',
          content: questions[questionCount]
        }
      }

      return {
        role: 'assistant',
        content: "Thank you for your responses! Would you like me to end this interview and provide feedback, or do you have any questions about the interview process?"
      }
    }

    const response = getFallbackResponse(messages, endInterview)
    
    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error in interview API:', error)
    return NextResponse.json(
      { error: 'Failed to process interview request' },
      { status: 500 }
    )
  }
}
