"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Save, 
  Eye, 
  EyeOff, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  FileText,
  Building2,
  Clock,
  Star,
  Moon,
  Sun,
  Maximize2,
  Minimize2
} from 'lucide-react'
import SecureViewer from '@/components/SecureViewer'

interface ExamResource {
  id: string
  title: string
  category: 'WRITTEN_EXAM' | 'INTERVIEW_PREP'
  content_type: 'TEXT' | 'PDF_URL'
  text_content?: string
  file_url?: string
  institution: string
  featured: boolean
  estimated_reading_time?: number
  view_count?: number
  created_at: string
  updated_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [resources, setResources] = useState<ExamResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('create')
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'WRITTEN_EXAM' as 'WRITTEN_EXAM' | 'INTERVIEW_PREP',
    content_type: 'TEXT' as 'TEXT' | 'PDF_URL',
    text_content: '',
    file_url: '',
    institution: '',
    featured: false,
    estimated_reading_time: 15
  })
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false)
  const [previewResource, setPreviewResource] = useState<ExamResource | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/exam-resources')
      const data = await response.json()
      setResources(data.resources || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'WRITTEN_EXAM',
      content_type: 'TEXT',
      text_content: '',
      file_url: '',
      institution: '',
      featured: false,
      estimated_reading_time: 15
    })
    setEditingId(null)
    setShowPreview(false)
    setPreviewResource(null)
  }

  const handlePreview = () => {
    const previewData: ExamResource = {
      id: 'preview',
      title: formData.title || 'Preview Title',
      category: formData.category,
      content_type: formData.content_type,
      text_content: formData.text_content || '<p>This is a preview of your content. The actual content will appear here.</p>',
      file_url: formData.file_url,
      institution: formData.institution || 'Preview Institution',
      featured: formData.featured,
      estimated_reading_time: formData.estimated_reading_time,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    setPreviewResource(previewData)
    setShowPreview(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.institution || !formData.category || !formData.content_type) {
      alert('Please fill in all required fields')
      return
    }

    if (formData.content_type === 'TEXT' && !formData.text_content) {
      alert('Please provide text content for TEXT type')
      return
    }

    if (formData.content_type === 'PDF_URL' && !formData.file_url) {
      alert('Please provide a file URL for PDF type')
      return
    }

    setIsSaving(true)
    try {
      const url = editingId 
        ? `/api/exam-resources/${editingId}`
        : '/api/exam-resources'
      
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchResources()
        resetForm()
        setActiveTab('list')
        alert(editingId ? 'Resource updated successfully!' : 'Resource created successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to save resource'}`)
      }
    } catch (error) {
      console.error('Error saving resource:', error)
      alert('Failed to save resource')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (resource: ExamResource) => {
    setFormData({
      title: resource.title,
      category: resource.category,
      content_type: resource.content_type,
      text_content: resource.text_content || '',
      file_url: resource.file_url || '',
      institution: resource.institution,
      featured: resource.featured,
      estimated_reading_time: resource.estimated_reading_time || 15
    })
    setEditingId(resource.id)
    setActiveTab('create')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return
    }

    try {
      const response = await fetch(`/api/exam-resources/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchResources()
        alert('Resource deleted successfully!')
      } else {
        alert('Failed to delete resource')
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
      alert('Failed to delete resource')
    }
  }

  if (showPreview && previewResource) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SecureViewer resource={previewResource} />
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setShowPreview(false)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Exit Preview
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Resource Command Center
            </h1>
            <p className="text-lg text-gray-600">
              Manage exam resources and interview preparation materials
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">
                {editingId ? 'Edit Resource' : 'Create Resource'}
              </TabsTrigger>
              <TabsTrigger value="list">All Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{editingId ? 'Edit Resource' : 'Create New Resource'}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handlePreview}
                        disabled={!formData.title}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      {editingId && (
                        <Button variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter resource title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="institution">Institution *</Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        placeholder="e.g., Rwanda Revenue Authority"
                      />
                    </div>
                  </div>

                  {/* Category and Content Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange('category', value)}
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
                        onValueChange={(value) => handleInputChange('content_type', value)}
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
                  </div>

                  {/* Content based on type */}
                  {formData.content_type === 'TEXT' ? (
                    <div>
                      <Label htmlFor="text_content">Content *</Label>
                      <Textarea
                        id="text_content"
                        value={formData.text_content}
                        onChange={(e) => handleInputChange('text_content', e.target.value)}
                        placeholder="Paste your exam content here (HTML supported)"
                        rows={12}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        HTML tags are supported. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, etc. for formatting.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="file_url">PDF URL *</Label>
                      <Input
                        id="file_url"
                        value={formData.file_url}
                        onChange={(e) => handleInputChange('file_url', e.target.value)}
                        placeholder="https://example.com/document.pdf"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter a direct URL to the PDF file
                      </p>
                    </div>
                  )}

                  {/* Additional Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimated_reading_time">Estimated Reading Time (minutes)</Label>
                      <Input
                        id="estimated_reading_time"
                        type="number"
                        value={formData.estimated_reading_time}
                        onChange={(e) => handleInputChange('estimated_reading_time', parseInt(e.target.value) || 15)}
                        min={1}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange('featured', checked)}
                      />
                      <Label htmlFor="featured" className="cursor-pointer">
                        Mark as featured resource
                      </Label>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSaving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingId ? 'Update Resource' : 'Create Resource'}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Resources ({resources.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading resources...</p>
                    </div>
                  ) : resources.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
                      <p className="text-gray-600">Create your first resource to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                                {resource.featured && (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    <Star className="w-3 h-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  {resource.institution}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4" />
                                  {resource.category.replace('_', ' ')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {resource.content_type}
                                </span>
                                {resource.estimated_reading_time && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {resource.estimated_reading_time} min
                                  </span>
                                )}
                                {resource.view_count !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {resource.view_count} views
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                Created: {new Date(resource.created_at).toLocaleDateString()}
                                {resource.updated_at !== resource.created_at && (
                                  <> | Updated: {new Date(resource.updated_at).toLocaleDateString()}</>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(resource)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(resource.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
