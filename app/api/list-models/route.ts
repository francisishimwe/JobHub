import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'GEMINI_API_KEY is not set in environment variables' 
      }, { status: 500 })
    }
    
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // List all available models
    const models = await genAI.listModels()
    
    const modelList = models.map(model => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedGenerationMethods: model.supportedGenerationMethods,
      temperature: model.temperature,
      topP: model.topP,
      topK: model.topK
    }))
    
    console.log('Available models:', modelList)
    
    return NextResponse.json({ 
      success: true, 
      models: modelList,
      count: modelList.length
    })
  } catch (error: any) {
    console.error('List models error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.stack
    }, { status: 500 })
  }
}
