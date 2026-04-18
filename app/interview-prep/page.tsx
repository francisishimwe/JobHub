'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SecureViewer } from '@/components/secure-viewer'
import { Breadcrumb } from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MessageSquare, Clock, Star, Building2, Filter, X } from 'lucide-react'
import { SkeletonCard } from '@/components/skeleton-card'

interface InterviewResource {
  id: string
  title: string
  category: string
  content_type: 'TEXT' | 'PDF_URL'
  institution: string
  featured: boolean
  estimated_reading_time?: number
  created_at: string
}

export default function InterviewPrepPage() {
  const [resources, setResources] = useState<InterviewResource[]>([])
  const [filteredResources, setFilteredResources] = useState<InterviewResource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState<InterviewResource | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState<string>('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [institutions, setInstitutions] = useState<string[]>([])

  useEffect(() => {
    fetchResources()
  }, [])

  useEffect(() => {
    filterResources()
  }, [resources, searchQuery, selectedInstitution, showFeaturedOnly])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/exam-resources?category=INTERVIEW_PREP')
      const data = await response.json()
      setResources(data.resources || [])
      
      // Extract unique institutions
      const uniqueInstitutions = [...new Set((data.resources || []).map((r: InterviewResource) => r.institution))] as string[]
      setInstitutions(uniqueInstitutions)
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterResources = () => {
    let filtered = [...resources]
    
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.institution.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (selectedInstitution) {
      filtered = filtered.filter(resource => resource.institution === selectedInstitution)
    }
    
    if (showFeaturedOnly) {
      filtered = filtered.filter(resource => resource.featured)
    }
    
    setFilteredResources(filtered)
  }

  const openResource = (resource: InterviewResource) => {
    setSelectedResource(resource)
    setIsViewerOpen(true)
  }

  const closeViewer = () => {
    setIsViewerOpen(false)
    setSelectedResource(null)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedInstitution('')
    setShowFeaturedOnly(false)
  }

  const hasActiveFilters = searchQuery || selectedInstitution || showFeaturedOnly

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb skeleton */}
            <div className="h-6 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
            
            {/* Header skeleton */}
            <div className="text-center mb-8">
              <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>

            {/* Filter section skeleton */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
              <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>

            {/* Resources grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={[
              { label: 'Exam Prep', href: '/exams' },
              { label: 'Interview Preparation' }
            ]} 
          />
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Interview Preparation Resources
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Master interview techniques with curated guides and practice materials for Rwandan job opportunities
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by title or institution..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Institution Filter */}
              <div className="w-full lg:w-64">
                <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((institution) => (
                      <SelectItem key={institution} value={institution}>
                        {institution}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Filter */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="featured" className="text-sm text-gray-700 cursor-pointer">
                  Featured only
                </label>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden group"
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span>{resource.institution}</span>
                      </div>
                    </div>
                    {resource.featured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current flex-shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{resource.content_type === 'TEXT' ? 'Text' : 'PDF'}</span>
                    </div>
                    {resource.estimated_reading_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{resource.estimated_reading_time} min</span>
                      </div>
                    )}
                  </div>

                  {/* View Button */}
                  <Button
                    onClick={() => openResource(resource)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    View Resource
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredResources.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search query'
                  : 'No interview resources are available at the moment'
                }
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Secure Viewer Modal */}
      {selectedResource && (
        <SecureViewer
          resource={selectedResource}
          isOpen={isViewerOpen}
          onClose={closeViewer}
        />
      )}
    </div>
  )
}
