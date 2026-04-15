"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Send, Bot, User, Loader2, Square, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function ResourcesPageContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [isInterviewEnded, setIsInterviewEnded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (category === 'interview' && !isInterviewStarted) {
      startInterview()
    }
  }, [category])

  const startInterview = async () => {
    setIsInterviewStarted(true)
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        setMessages([aiMessage])
      }
    } catch (error) {
      console.error('Error starting interview:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || isInterviewEnded) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const endInterview = async () => {
    if (isInterviewEnded) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: messages,
          endInterview: true 
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const summaryMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, summaryMessage])
        setIsInterviewEnded(true)
      }
    } catch (error) {
      console.error('Error ending interview:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // If no category specified, show category selection
  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <MessageCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Interview Preparation Resources
              </h1>
              <p className="text-xl text-gray-600">
                Choose a resource category to get started
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <a 
                href="/resources?category=interview"
                className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="mb-4">
                  <MessageCircle className="h-12 w-12 text-orange-600 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AI Interview Coach
                </h3>
                <p className="text-gray-600">
                  Practice with our AI coach for Rwandan job interviews
                </p>
              </a>
              
              <a 
                href="/resources?category=qa"
                className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="mb-4">
                  <MessageCircle className="h-12 w-12 text-blue-600 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Q&A Resources
                </h3>
                <p className="text-gray-600">
                  Browse technical exam questions and answers
                </p>
              </a>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    )
  }

  // Q&A Category placeholder
  if (category === 'qa') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Job Prep Questions & Answers
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Q&A resources coming soon...
            </p>
            <a href="/resources" className="text-blue-600 hover:text-blue-700">
              &larr; Back to Resources
            </a>
          </div>
        </main>
        
        <Footer />
      </div>
    )
  }

  // Interview Chat Interface
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Chat Header */}
          <div className="bg-white rounded-t-2xl border border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">AI Interview Coach</h2>
                <p className="text-sm text-gray-600">
                  {isInterviewEnded ? 'Interview Completed' : 'Practice Interview'}
                </p>
              </div>
            </div>
            
            {isInterviewStarted && !isInterviewEnded && (
              <Button
                onClick={endInterview}
                variant="outline"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Square className="h-4 w-4" />
                End Interview
              </Button>
            )}
          </div>
          
          {/* Messages Container */}
          <div className="bg-white border-x border-slate-200 flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[600px]">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Starting your interview practice...</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-blue-600'
                        : 'bg-orange-100'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-4">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isInterviewEnded 
                    ? "Interview completed. Start a new interview?" 
                    : "Type your response..."
                }
                disabled={isLoading || isInterviewEnded}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
              
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading || isInterviewEnded}
                className="px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
              
              {isInterviewEnded && (
                <Button
                  onClick={() => window.location.href = '/resources?category=interview'}
                  variant="outline"
                >
                  New Interview
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResourcesPageContent />
    </Suspense>
  )
}
