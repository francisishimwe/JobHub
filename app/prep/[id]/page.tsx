"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import SecureViewer from '@/components/SecureViewer'

interface Resource {
  id: string
  title: string
  institution: string
  category: string
  content_type: 'TEXT' | 'PDF_URL'
  text_content?: string
  file_url?: string
  study_time?: number
  view_count?: number
  created_at: string
  updated_at: string
}

export default function PrepPage() {
  const params = useParams()
  const router = useRouter()
  const [resource, setResource] = useState<Resource | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchResource(params.id as string)
    }
  }, [params.id])

  const fetchResource = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/exam-resources/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Resource not found')
        } else {
          setError('Failed to load resource')
        }
        return
      }

      const data = await response.json()
      setResource(data.resource)
    } catch (error) {
      console.error('Error fetching resource:', error)
      setError('Failed to load resource')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading resource...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-red-800 mb-4">
                  {error || 'Resource not found'}
                </h2>
                <p className="text-red-600 mb-6">
                  The resource you're looking for doesn't exist or has been removed.
                </p>
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <SecureViewer resource={resource} />
  )
}
