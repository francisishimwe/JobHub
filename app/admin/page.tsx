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
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  Minimize2,
  CheckCircle,
  X,
  User
} from 'lucide-react'
import SecureViewer from '@/components/SecureViewer'
import { QuestionManagement } from '@/components/question-management'
import { RoadRulesQuestionManagement } from '@/components/road-rules-question-management'

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

interface MembershipUser {
  id: string
  full_name: string
  phone_number: string
  is_approved: boolean
  expires_at: string
  created_at: string
}

export default function AdminPage() { // Admin Dashboard with 5-tab system - Updated
  const router = useRouter()
  const [resources, setResources] = useState<ExamResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('create')
  
  // User management state
  const [users, setUsers] = useState<MembershipUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState("")
  const [extensionDays, setExtensionDays] = useState<string>("10")
  
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
    fetchUsers()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/exam-resources-simple')
      const data = await response.json()
      setResources(data.resources || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/membership-users")
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users || [])
      } else {
        setUsersError(data.message || "Ikibazo kubona abantu")
      }
    } catch (err) {
      console.error("Fetch users error:", err)
      setUsersError("Ikibazo gikomeye serivisi - DATABASE_URL itashizwe")
    } finally {
      setUsersLoading(false)
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
      const url = editingId ? `/api/exam-resources-simple/${editingId}` : '/api/exam-resources-simple'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
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

  const handleApprove = async (userId: string, days: string = "10") => {
    try {
      const response = await fetch("/api/approve-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          extensionDays: parseInt(days)
        }),
      })

      if (response.ok) {
        await fetchUsers()
        alert("User approved successfully!")
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Failed to approve user"}`)
      }
    } catch (err) {
      console.error("Approve user error:", err)
      alert("Ikibazo gikomeye serivisi")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      const response = await fetch("/api/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        await fetchUsers()
        alert("User deleted successfully!")
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Failed to delete user"}`)
      }
    } catch (err) {
      console.error("Delete user error:", err)
      alert("Ikibazo gikomeye serivisi")
    }
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
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
      const response = await fetch(`/api/exam-resources-simple/${id}`, {
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="employer-approvals">Employer Approvals</TabsTrigger>
              <TabsTrigger value="road-rules-management">Road Rules Management</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            </TabsList>

            <TabsContent value="employer-approvals" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Employer Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Employer approval system coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="road-rules-management" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Ubufatanye bwa Abanyamizi ba Iga Amategeko
                    </h2>
                    <p className="text-gray-600">
                      Kugirango abanyamizi bari kugira ngo uburenganzira no kuzamura.
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usersError && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        {usersError}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Abanyamizi Bari Kugirango Uburenganzira
                    </h3>
                    
                    <div className="mb-4">
                      <Label htmlFor="extension">Kongera iminsi (igihe)</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="extension"
                          type="number"
                          value={extensionDays}
                          onChange={(e) => setExtensionDays(e.target.value)}
                          placeholder="10"
                          className="w-32"
                          min="1"
                          max="365"
                        />
                        <span className="text-sm text-gray-600">iminsi</span>
                      </div>
                    </div>
                  </div>

                  {usersLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-4">
                        <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nta banyamizi bari kugirango uburenganzira
                        </h3>
                        <p className="text-gray-600">
                          Abanyamizi baza kugaragara hano nyuma yo kwiyandikisha.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Amazina</th>
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Nomero ya Telefone</th>
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Leta</th>
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Ubufatanye</th>
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Imisi</th>
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Ibikorwa</th>
                            <th className="text-center p-3 font-semibold text-gray-900 border-b">Igikorwa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                              <td className="p-3">{user.full_name}</td>
                              <td className="p-3">{user.phone_number}</td>
                              <td className="p-3">{new Date(user.created_at).toLocaleDateString('rw-RW')}</td>
                              <td className="p-3">
                                {isExpired(user.expires_at) ? (
                                  <Badge variant="destructive">Yarabuze</Badge>
                                ) : (
                                  <Badge variant="default">Kiri</Badge>
                                )}
                              </td>
                              <td className="p-3">{new Date(user.expires_at).toLocaleDateString('rw-RW')}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  {user.is_approved ? (
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Yemewe
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Isubizwe
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  {!user.is_approved && (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => handleApprove(user.id, extensionDays)}
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Yemera
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    <X className="h-3 w-3" />
                                    Gusiba
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="road-rules-management" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Amategeko Questions Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <RoadRulesQuestionManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Jobs Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Jobs management system coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exams" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job & Interview Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Manage job interview preparation questions and written exam materials.
                  </p>
                  {/* This is where your existing job/interview question management goes */}
                  <div className="text-center py-8 text-gray-500">
                    <p>Job & Interview question management system...</p>
                    <p className="text-sm mt-2">(Your existing job questions system)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inquiries" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inquiries Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Inquiries management system coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

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
                <CardContent className="p-0">
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
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Category
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {resources.map((resource) => (
                            <tr key={resource.id} className="border-b hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {resource.featured && (
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                                      <Star className="w-3 h-3 mr-1" />
                                      Featured
                                    </Badge>
                                  )}
                                  <span className="font-medium text-gray-900 truncate max-w-xs">
                                    {resource.title}
                                  </span>
                                </div>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                {new Date(resource.created_at).toLocaleDateString()}
                              </td>
                              <td className="border border-gray-200 px-4 py-3">
                                <Badge className={
                                  resource.category === 'WRITTEN_EXAM' 
                                    ? 'bg-blue-100 text-blue-800 text-xs' 
                                    : 'bg-orange-100 text-orange-800 text-xs'
                                }>
                                  {resource.category.replace('_', ' ')}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="road-rules" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Ubufatanye bwa Abanyamizi ba Iga Amategeko
                    </h2>
                    <p className="text-gray-600">
                      Kugirango abanyamizi bari kugira ngo uburenganzira no kuzamura.
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usersError && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        {usersError}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Abanyamizi Bari Kugirango Uburenganzira
                    </h3>
                    
                    <div className="mb-4">
                      <Label htmlFor="extension">Kongera iminsi (igihe)</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="extension"
                          type="number"
                          value={extensionDays}
                          onChange={(e) => setExtensionDays(e.target.value)}
                          placeholder="10"
                          className="w-32"
                          min="1"
                          max="365"
                        />
                        <span className="text-sm text-gray-600">iminsi</span>
                      </div>
                    </div>
                  </div>

                  {usersLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-4">
                        <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nta banyamizi bari kugirango uburenganzira
                        </h3>
                        <p className="text-gray-600">
                          Abanyamizi baza kugaragara hano nyuma yo kwiyandikisha.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Amazina</th>
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Nomero ya Telefone</th>
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Leta</th>
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Ubufatanye</th>
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Imisi</th>
                            <th className="text-left p-3 font-semibold text-gray-900 border-b">Ibikorwa</th>
                            <th className="text-center p-3 font-semibold text-gray-900 border-b">Igikorwa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                              <td className="p-3">{user.full_name}</td>
                              <td className="p-3">{user.phone_number}</td>
                              <td className="p-3">{new Date(user.created_at).toLocaleDateString('rw-RW')}</td>
                              <td className="p-3">
                                {isExpired(user.expires_at) ? (
                                  <Badge variant="destructive">Yarabuze</Badge>
                                ) : (
                                  <Badge variant="default">Kiri</Badge>
                                )}
                              </td>
                              <td className="p-3">{new Date(user.expires_at).toLocaleDateString('rw-RW')}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  {user.is_approved ? (
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Yemewe
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Isubizwe
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  {!user.is_approved && (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => handleApprove(user.id, extensionDays)}
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Yemera
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    <X className="h-3 w-3" />
                                    Gusiba
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
