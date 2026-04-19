"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Maximize2, 
  Minimize2, 
  Moon, 
  Sun, 
  Eye, 
  EyeOff,
  ArrowLeft,
  BookOpen,
  Clock
} from 'lucide-react'

interface SecureViewerProps {
  resource: {
    id: string
    title: string
    institution: string
    category: string
    content_type: 'TEXT' | 'PDF_URL'
    text_content?: string
    file_url?: string
    study_time?: number
    view_count?: number
  }
}

export default function SecureViewer({ resource }: SecureViewerProps) {
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [showWatermark, setShowWatermark] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [viewCount, setViewCount] = useState(resource.view_count || 0)

  // Update view count when component mounts
  useEffect(() => {
    const updateViewCount = async () => {
      try {
        await fetch(`/api/exam-resources/${resource.id}/view`, {
          method: 'POST'
        })
        setViewCount(prev => prev + 1)
      } catch (error) {
        console.error('Failed to update view count:', error)
      }
    }
    updateViewCount()
  }, [resource.id])

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100
        setScrollProgress(Math.min(progress, 100))
      }
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll)
      return () => contentElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Prevent right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    return false
  }

  // Prevent text selection
  const handleSelectStart = (e: React.SyntheticEvent) => {
    e.preventDefault()
    return false
  }

  // Prevent copy
  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault()
    return false
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const goBack = () => {
    router.back()
  }

  const renderContent = () => {
    if (resource.content_type === 'PDF_URL' && resource.file_url) {
      return (
        <iframe
          src={resource.file_url}
          className="w-full h-full border-0 rounded-lg"
          title={resource.title}
          onContextMenu={handleContextMenu}
        />
      )
    }

    if (resource.content_type === 'TEXT' && resource.text_content) {
      return (
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: resource.text_content }}
        />
      )
    }

    return <div className="text-center text-gray-500">No content available</div>
  }

  return (
    <div 
      className={`min-h-screen relative transition-colors duration-300 ${
        isFocusMode 
          ? 'bg-gray-900 text-gray-100' 
          : 'bg-gray-50 text-gray-900'
      }`}
      onContextMenu={handleContextMenu}
      onCopy={handleCopy}
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header Controls */}
      <header className={`sticky top-1 z-40 backdrop-blur-sm ${
        isFocusMode ? 'bg-gray-800/90' : 'bg-white/90'
      } border-b ${isFocusMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className={isFocusMode ? 'text-gray-300 hover:text-white' : ''}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div className="hidden md:block">
                <h1 className={`font-semibold ${isFocusMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {resource.title}
                </h1>
                <p className={`text-sm ${isFocusMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {resource.institution}
                </p>
              </div>
            </div>

            {/* Right Section - Controls */}
            <div className="flex items-center space-x-2">
              {/* Study Stats */}
              <div className={`hidden md:flex items-center space-x-4 mr-4 text-sm ${
                isFocusMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{viewCount} views</span>
                </div>
                {resource.study_time && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{resource.study_time} min</span>
                  </div>
                )}
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{resource.category.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWatermark(!showWatermark)}
                className={isFocusMode ? 'text-gray-300 hover:text-white' : ''}
              >
                {showWatermark ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={isFocusMode ? 'text-gray-300 hover:text-white' : ''}
              >
                {isFocusMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className={isFocusMode ? 'text-gray-300 hover:text-white' : ''}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="relative">
          {/* Content Container */}
          <div
            ref={contentRef}
            className={`relative max-w-4xl mx-auto rounded-lg shadow-xl overflow-y-auto ${
              isFocusMode ? 'bg-gray-800' : 'bg-white'
            }`}
            style={{ height: 'calc(100vh - 120px)' }}
          >
            <div className="p-8">
              {renderContent()}
            </div>
          </div>

          {/* Watermark Overlay */}
          {showWatermark && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div 
                className="transform rotate-45 text-gray-300 font-bold text-6xl opacity-10 select-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Rwanda Job Hub
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CSS for print prevention and other security measures */}
      <style jsx>{`
        @media print {
          * {
            display: none !important;
          }
        }
        
        ::selection {
          background: transparent !important;
          color: inherit !important;
        }
        
        ::-moz-selection {
          background: transparent !important;
          color: inherit !important;
        }
        
        ::-webkit-selection {
          background: transparent !important;
          color: inherit !important;
        }
      `}</style>
    </div>
  )
}
