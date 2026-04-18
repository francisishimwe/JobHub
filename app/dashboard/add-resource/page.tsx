'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SecureViewer } from '@/components/secure-viewer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, Eye, EyeOff, FileText, Link, Clock } from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Toggle } from '@/components/ui/toggle'

interface ResourceFormData {
  title: string
  category: 'WRITTEN_EXAM' | 'INTERVIEW_PREP'
  content_type: 'TEXT' | 'PDF_URL'
  text_content: string
  file_url: string
  institution: string
  featured: boolean
  estimated_reading_time: number
}

export default function AddResourcePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    category: 'WRITTEN_EXAM',
    content_type: 'TEXT',
    text_content: '',
    file_url: '',
    institution: '',
    featured: false,
    estimated_reading_time: 0
  })

  // TipTap editor for rich text
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.text_content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, text_content: editor.getHTML() }))
    },
  })

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  // Redirect employers away from admin area
  if (user?.role === 'employer') {
    router.push('/select-plan')
    return null
  }

  const handleInputChange = (field: keyof ResourceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required')
      setIsLoading(false)
      return
    }

    if (!formData.institution.trim()) {
      setError('Institution is required')
      setIsLoading(false)
      return
    }

    if (formData.content_type === 'TEXT' && !formData.text_content.trim()) {
      setError('Content is required when content type is Text')
      setIsLoading(false)
      return
    }

    if (formData.content_type === 'PDF_URL' && !formData.file_url.trim()) {
      setError('File URL is required when content type is PDF URL')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/exam-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create resource')
      }

      setSuccess(true)
      // Reset form
      setFormData({
        title: '',
        category: 'WRITTEN_EXAM',
        content_type: 'TEXT',
        text_content: '',
        file_url: '',
        institution: '',
        featured: false,
        estimated_reading_time: 0
      })
      editor?.commands.setContent('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create resource')
    } finally {
      setIsLoading(false)
    }
  }

  const previewResource = {
    id: 'preview',
    title: formData.title || 'Untitled Resource',
    category: formData.category,
    content_type: formData.content_type,
    text_content: formData.text_content,
    file_url: formData.file_url,
    institution: formData.institution || 'Unknown Institution',
    featured: formData.featured,
    estimated_reading_time: formData.estimated_reading_time,
    created_at: new Date().toISOString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Resource</h1>
              <p className="text-gray-600">Create exam or interview preparation materials</p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Resource created successfully! You can add another resource or go back to the dashboard.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter resource title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="institution">Institution *</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      placeholder="e.g., RRA, BK, Irembo"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: 'WRITTEN_EXAM' | 'INTERVIEW_PREP') => 
                        handleInputChange('category', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WRITTEN_EXAM">Written Exam</SelectItem>
                        <SelectItem value="INTERVIEW_PREP">Interview Preparation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="content_type">Content Type *</Label>
                    <Select
                      value={formData.content_type}
                      onValueChange={(value: 'TEXT' | 'PDF_URL') => 
                        handleInputChange('content_type', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEXT">Text Content</SelectItem>
                        <SelectItem value="PDF_URL">PDF URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="estimated_reading_time">Estimated Reading Time (minutes)</Label>
                    <Input
                      id="estimated_reading_time"
                      type="number"
                      min="0"
                      value={formData.estimated_reading_time}
                      onChange={(e) => handleInputChange('estimated_reading_time', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 15"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                    <Label htmlFor="featured">Featured (will appear at top)</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {formData.content_type === 'TEXT' ? <FileText className="w-5 h-5" /> : <Link className="w-5 h-5" />}
                    Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.content_type === 'TEXT' ? (
                    <div>
                      <Label htmlFor="text_content">Text Content *</Label>
                      <div className="border rounded-md">
                        <div className="border-b p-2 flex gap-2">
                          <Toggle
                            pressed={editor?.isActive('bold')}
                            onPressedChange={() => editor?.chain().focus().toggleBold().run()}
                            size="sm"
                          >
                            Bold
                          </Toggle>
                          <Toggle
                            pressed={editor?.isActive('italic')}
                            onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
                            size="sm"
                          >
                            Italic
                          </Toggle>
                          <Toggle
                            pressed={editor?.isActive('bulletList')}
                            onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
                            size="sm"
                          >
                            Bullet List
                          </Toggle>
                        </div>
                        <div className="min-h-[200px] p-3">
                          <EditorContent editor={editor} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="file_url">PDF URL *</Label>
                      <Input
                        id="file_url"
                        value={formData.file_url}
                        onChange={(e) => handleInputChange('file_url', e.target.value)}
                        placeholder="https://example.com/document.pdf"
                        required
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Creating...' : 'Create Resource'}
                </Button>
              </div>
            </div>
          </form>

          {/* Preview Section */}
          {showPreview && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Preview</h2>
              <SecureViewer
                resource={previewResource}
                isOpen={true}
                onClose={() => setShowPreview(false)}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
