"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { useJobs } from "@/lib/job-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { Header } from "@/components/header"
import { CategoryDropdownSearch } from "@/components/category-dropdown-search"
import { useExamResources, ExamResourcesProvider } from "@/lib/exam-resources-context"
import { ExamResourceCard } from "@/components/exam-resource-card"
import { BookOpen, FileText, GraduationCap } from "lucide-react"
import { RoadRulesBanner } from "@/components/road-rules-banner"
import { AppDownloadCard } from "@/components/app-download-card"

export default function HomePage() {
  return (


      <HomePageContent />

    
    
  )
}

function HomePageContent() {
  const { jobs, filteredJobs, isLoading, filters, setFilters } = useJobs()
  
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "deadline">("newest")


  // Sort jobs based on columns that actually exist in your Supabase table
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        // Use created_at because it exists in your Supabase 'jobs' table
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      case "oldest":
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      case "deadline":
        if (!a.deadline && !b.deadline) return 0
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      default:
        return 0
    }
  })

  const getSortLabel = () => {
    switch (sortBy) {
      case "newest": return "Newest"
      case "oldest": return "Oldest"
      case "deadline": return "Deadline"
      default: return "Newest"
    }
  }

  // Calculate real counts for each opportunity type
  const getOpportunityCounts = () => {
    const counts = {
      featured: 0,
      jobs: 0,
      tenders: 0,
      internships: 0,
      scholarships: 0,
      education: 0,
      blogs: 0
    }

    
    // Use the full jobs array for counting, not filteredJobs
    if (jobs && jobs.length > 0) {
      jobs.forEach((job, index) => {
        const opportunityType = job.opportunityType?.toLowerCase() || job.opportunity_type?.toLowerCase() || ''
        
        // Count by opportunity type - MATCH FILTERING LOGIC EXACTLY
        if (opportunityType.includes('job') || opportunityType.includes('full') || opportunityType.includes('permanent')) {
          counts.jobs++
        }
        if (opportunityType.includes('tender') || opportunityType.includes('bid')) {
          counts.tenders++
        }
        if (opportunityType.includes('intern') || opportunityType.includes('trainee')) {
          counts.internships++
        }
        if (opportunityType.includes('scholarship')) {
          counts.scholarships++
        }
        if (opportunityType.includes('education') || opportunityType.includes('course')) {
          counts.education++
        }
        if (opportunityType.includes('blog') || opportunityType.includes('article')) {
          counts.blogs++
        }
        
        // Featured count = total jobs when no filters applied
        counts.featured = jobs.length
      })
    }

    return counts
  }

  const opportunityCounts = getOpportunityCounts()

  // Handle opportunity type clicks
  const handleOpportunityClick = (type: string) => {
    if (type === 'featured') {
      // Show all items when Featured is clicked (clear opportunityTypes filter)
      setFilters({ opportunityTypes: [] })
    } else {
      // Filter by specific type
      setFilters({ opportunityTypes: [type] })
    }
  }

  return (


      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Subtle radial gradient in top-right corner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none"></div>
        
        <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 mb-8">
        <div className="max-w-[95%] mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 animate-fade-in">
              Connecting Rwanda's Best Talent
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Discover opportunities, advance your career, and connect with top employers across Rwanda
            </p>
            {/* Hero Search Box */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-2 border border-slate-200/50">
                <CategoryDropdownSearch />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Category Bar - Desktop Only */}
      <div className="bg-slate-800 border-b border-slate-700/30 mb-4">
        <div className="max-w-[95%] mx-auto py-3 px-4">
          {/* Desktop: Single Horizontal Line - All 7 Categories */}
          <div className="hidden lg:flex items-center justify-center gap-x-10">
            <Button 
              variant="ghost" 
              className="text-white border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all px-4 py-2 rounded-lg font-medium hover:scale-105"
              onClick={() => handleOpportunityClick('featured')}
            >
              Featured
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.featured}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all px-4 py-2 rounded-lg font-medium hover:scale-105"
              onClick={() => handleOpportunityClick('job')}
            >
              Jobs
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.jobs}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all px-4 py-2 rounded-lg font-medium hover:scale-105"
              onClick={() => handleOpportunityClick('tender')}
            >
              Tenders
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.tenders}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all px-4 py-2 rounded-lg font-medium hover:scale-105"
              onClick={() => handleOpportunityClick('blog')}
            >
              Blogs
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.blogs}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all px-4 py-2 rounded-lg font-medium hover:scale-105"
              onClick={() => handleOpportunityClick('internship')}
            >
              Internships
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.internships}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all px-4 py-2 rounded-lg font-medium hover:scale-105"
              onClick={() => handleOpportunityClick('scholarship')}
            >
              Scholarships
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.scholarships}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all px-4 py-2 rounded-lg font-medium hover:scale-105"
              onClick={() => handleOpportunityClick('education')}
            >
              Education
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.education}</span>
            </Button>
          </div>

          {/* Mobile: Grid Layout */}
          <div className="lg:hidden">
            {/* First Row - 4 items */}
            <div className="grid grid-cols-4 items-center justify-items-center gap-x-2 mb-2 text-[10px]">
              <Button 
                variant="ghost" 
                className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-2 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                onClick={() => handleOpportunityClick('featured')}
              >
                Featured
                <span className="ml-1 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[8px]">{opportunityCounts.featured}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-2 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                onClick={() => handleOpportunityClick('job')}
              >
                Jobs
                <span className="ml-1 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[8px]">{opportunityCounts.jobs}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-2 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                onClick={() => handleOpportunityClick('tender')}
              >
                Tenders
                <span className="ml-1 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[8px]">{opportunityCounts.tenders}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-2 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                onClick={() => handleOpportunityClick('blog')}
              >
                Blogs
                <span className="ml-1 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[8px]">{opportunityCounts.blogs}</span>
              </Button>
            </div>
            
            {/* Second Row - 3 items, centered */}
            <div className="flex justify-center gap-2 text-[10px]">
              <div className="flex justify-center gap-2 w-full max-w-md mx-auto">
                <Button 
                  variant="ghost" 
                  className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-2 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                  onClick={() => handleOpportunityClick('scholarship')}
                >
                  Scholarships
                  <span className="ml-1 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[8px]">{opportunityCounts.scholarships}</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-2 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                  onClick={() => handleOpportunityClick('education')}
                >
                  Education
                  <span className="ml-1 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[8px]">{opportunityCounts.education}</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-2 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                  onClick={() => handleOpportunityClick('internship')}
                >
                  Internships
                  <span className="ml-1 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[8px]">{opportunityCounts.internships}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 relative">
        {/* Modern mesh gradient background with radial glows */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-tr from-blue-50/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="max-w-[95%] mx-auto px-4 py-1">
          <main>
            {/* 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Left Column (75%) - Job and Exam Cards */}
              <div className="lg:col-span-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Showing results ({filteredJobs.length})</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        Sort: {getSortLabel()}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest First</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest First</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("deadline")}>Deadline (Soonest)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-4">
                  {isLoading && filteredJobs.length === 0 ? (
                    <div className="rounded-lg border bg-card p-12 text-center">
                      <p className="text-muted-foreground">Loading opportunities...</p>
                    </div>
                  ) : sortedJobs.length > 0 ? (
                    <>
                      {/* Desktop: Single Wide Column */}
                      <div className="hidden lg:grid lg:grid-cols-1 gap-4">
                        {sortedJobs.map((job) => (
                          <JobCard key={job.id} job={job} />
                        ))}
                      </div>

                      {/* Mobile: Single Column Full Width */}
                      <div className="lg:hidden space-y-4">
                        {sortedJobs.map((job) => (
                          <JobCard key={job.id} job={job} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border bg-card p-12 text-center">
                      <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (25%) - All Banners */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-4 space-y-4 pt-0 mt-0">
                  <RoadRulesBanner />
                  <AppDownloadCard />
                  {/* Additional ads/banners can be added here */}
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
      </div>
  )
}
