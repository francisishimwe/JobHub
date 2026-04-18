'use client'

import { useState, useEffect } from 'react'
import { X, Maximize2, Minimize2, Eye, EyeOff, Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExamResource {
  id: string
  title: string
  category: string
  content_type: 'TEXT' | 'PDF_URL'
  text_content?: string
  file_url?: string
  institution: string
  featured: boolean
  estimated_reading_time?: number
  created_at: string
}

interface SecureViewerProps {
  resource: ExamResource
  isOpen: boolean
  onClose: () => void
}

export function SecureViewer({ resource, isOpen, onClose }: SecureViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showWatermark, setShowWatermark] = useState(true)
  const [readingProgress, setReadingProgress] = useState(0)
  const [focusMode, setFocusMode] = useState(false)
  const [estimatedReadTime, setEstimatedReadTime] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  useEffect(() => {
    // Add global CSS to prevent printing
    const style = document.createElement('style')
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .secure-viewer-content, .secure-viewer-content * {
          visibility: visible;
        }
        .secure-viewer-content {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
      
      .no-select {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      .watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 48px;
        color: rgba(0, 0, 0, 0.1);
        pointer-events: none;
        z-index: 1000;
        white-space: nowrap;
        font-weight: bold;
        opacity: 0.3;
      }
      
      .focus-mode {
        background: #1a1a1a;
      }
      
      .focus-mode .secure-viewer-content {
        background: #2d2d2d;
        color: #e0e0e0;
      }
      
      .focus-mode .text-content {
        color: #e0e0e0;
        line-height: 1.8;
        max-width: 800px;
        margin: 0 auto;
        font-size: 18px;
      }
      
      .reading-stats {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1001;
        backdrop-filter: blur(10px);
      }
      
      .focus-mode .reading-stats {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (resource.content_type === 'TEXT') {
        const element = document.getElementById('text-content')
        if (element) {
          const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100
          setReadingProgress(Math.min(scrollPercentage, 100))
          
          // Start timing when user begins reading
          if (!startTime && scrollPercentage > 5) {
            setStartTime(Date.now())
          }
        }
      }
    }

    const element = document.getElementById('text-content')
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
  }, [resource.content_type, startTime])

  // Calculate estimated read time based on content
  useEffect(() => {
    if (resource.content_type === 'TEXT' && resource.text_content) {
      const wordCount = resource.text_content.split(/\s+/).length
      const wordsPerMinute = 200 // Average reading speed
      const estimatedMinutes = Math.ceil(wordCount / wordsPerMinute)
      setEstimatedReadTime(estimatedMinutes)
    } else if (resource.estimated_reading_time) {
      setEstimatedReadTime(resource.estimated_reading_time)
    }
  }, [resource])

  if (!isOpen) return null

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const renderContent = () => {
    if (resource.content_type === 'TEXT') {
      return (
        <div className="h-full overflow-auto relative">
          {showWatermark && (
            <div className="watermark">Rwanda Job Hub</div>
          )}
          <div
            id="text-content"
            className="p-8 text-gray-800 leading-relaxed no-select"
            onContextMenu={handleContextMenu}
            style={{ userSelect: 'none' }}
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-4">{resource.title}</h1>
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {resource.institution}
                </span>
                {resource.estimated_reading_time && (
                  <span>~{resource.estimated_reading_time} min read</span>
                )}
                <span>{new Date(resource.created_at).toLocaleDateString()}</span>
              </div>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: resource.text_content || '' }}
              />
            </div>
          </div>
        </div>
      )
    }

    if (resource.content_type === 'PDF_URL' && resource.file_url) {
      return (
        <div className="h-full relative">
          {showWatermark && (
            <div className="watermark">Rwanda Job Hub</div>
          )}
          <iframe
            src={resource.file_url}
            className="w-full h-full border-0 no-select"
            onContextMenu={handleContextMenu}
            style={{ userSelect: 'none' }}
            title={resource.title}
          />
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No content available</p>
      </div>
    )
  }

  // Calculate reading time elapsed
  const timeElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000 / 60) : 0
  const remainingTime = Math.max(0, estimatedReadTime - timeElapsed)

  return (
    <div className={`fixed inset-0 z-50 ${focusMode ? 'focus-mode' : 'bg-black bg-opacity-75'} flex items-center justify-center`}>
      <div className={`w-full h-full ${isFullscreen ? 'h-screen' : 'max-w-6xl max-h-screen'} rounded-lg overflow-hidden flex flex-col secure-viewer-content ${focusMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Header */}
        <div className={`${focusMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-b'} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <h2 className={`text-xl font-semibold truncate ${focusMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {resource.title}
            </h2>
            <span className={`${focusMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-100 text-blue-800'} px-3 py-1 rounded-full text-sm`}>
              {resource.institution}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFocusMode(!focusMode)}
              className={`${focusMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}
              title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
            >
              {focusMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWatermark(!showWatermark)}
              className={`${focusMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {showWatermark ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`${focusMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={`${focusMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Reading Progress Bar */}
        {resource.content_type === 'TEXT' && (
          <div className={`h-1 ${focusMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className={`h-full transition-all duration-300 ${focusMode ? 'bg-blue-400' : 'bg-blue-600'}`}
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>

        {/* Reading Stats */}
        {resource.content_type === 'TEXT' && (
          <div className="reading-stats">
            <div className="flex items-center gap-4 text-xs">
              <div>Progress: {Math.round(readingProgress)}%</div>
              <div>Time: {timeElapsed}m</div>
              <div>Est. remaining: {remainingTime}m</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
