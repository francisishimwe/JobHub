"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
        
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-slate-50">
          <div className="max-w-7xl mx-auto px-12 py-10">
            <div className="flex justify-between items-center">
              {/* Far Left - Mega-Square Logo Card */}
              <div className="h-64 w-64 rounded-3xl bg-white shadow-xl flex items-center justify-center p-8">
                <Link href="/" className="flex items-center justify-center">
                  <Image
                    src="/full logo.jpg"
                    alt="RwandaJobHub"
                    width={192}
                    height={192}
                    className="w-full h-full object-contain"
                  />
                </Link>
              </div>

              {/* Center - Headline and Subtext */}
              <div className="flex-1 text-center mx-12">
                <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-1 animate-fade-in">
                  Discover Opportunities Across Rwanda
                </h1>
                <p className="text-xl font-medium text-slate-500 max-w-3xl mx-auto">
                  Your Guide to Job Opportunities in Rwanda
                </p>
              </div>

              {/* Far Right - Actions */}
              <div className="flex items-center gap-6">
                <Button 
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-lg font-bold rounded-full transition-all active:scale-105 shadow-lg shadow-blue-200/50 flex items-center gap-3"
                >
                  <Link href="/select-plan">
                    <span className="text-lg sm:text-xl">+</span>
                    <span className="hidden sm:inline">Post a Job</span>
                    <span className="sm:hidden">Post a Job</span>
                  </Link>
                </Button>
                <Link 
                  href="/dashboard" 
                  className="text-base font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation & Filter Funnel - The Stack */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Top - Primary Links */}
            <nav className="flex items-center justify-center gap-10 py-4 mt-6">
              <Link href="/" className="text-slate-900 hover:text-blue-600 text-lg font-semibold transition-colors px-2 py-1 whitespace-nowrap">Home</Link>
              <Link href="/exams" className="text-slate-900 hover:text-blue-600 text-lg font-semibold transition-colors px-2 py-1 whitespace-nowrap">View Exams</Link>
              <Link href="/employers" className="text-slate-900 hover:text-blue-600 text-lg font-semibold transition-colors px-2 py-1 whitespace-nowrap">Partners</Link>
              <Link href="/testimonials" className="text-slate-900 hover:text-blue-600 text-lg font-semibold transition-colors px-2 py-1 whitespace-nowrap">Testimonials</Link>
              <Link href="/help" className="text-slate-900 hover:text-blue-600 text-lg font-semibold transition-colors px-2 py-1 whitespace-nowrap">Help</Link>
              <Link href="/about" className="text-slate-900 hover:text-blue-600 text-lg font-semibold transition-colors px-2 py-1 whitespace-nowrap">About Us</Link>
              <Link href="/contact" className="text-slate-900 hover:text-blue-600 text-lg font-semibold transition-colors px-2 py-1 whitespace-nowrap">Contact Us</Link>
            </nav>

            {/* Middle - Filter Tabs */}
            <div className="bg-slate-50 border-b border-slate-200/50 mt-4">
              <div className="px-6 py-3">
                {/* Desktop: Clean Tab-style Categories */}
                <div className="hidden lg:flex items-center justify-center gap-x-8">
                  <Button 
                    variant="ghost" 
                    className={`text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-4 py-2 rounded-none text-sm ${filters.opportunityTypes?.includes('featured') ? 'text-blue-600 border-blue-600 font-semibold' : ''}`}
                    onClick={() => handleOpportunityClick('featured')}
                  >
                    Featured{opportunityCounts.featured > 0 && ` (${opportunityCounts.featured})`}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-4 py-2 rounded-none text-sm ${filters.opportunityTypes?.includes('jobs') ? 'text-blue-600 border-blue-600 font-semibold' : ''}`}
                    onClick={() => handleOpportunityClick('jobs')}
                  >
                    Jobs{opportunityCounts.jobs > 0 && ` (${opportunityCounts.jobs})`}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-4 py-2 rounded-none text-sm ${filters.opportunityTypes?.includes('tenders') ? 'text-blue-600 border-blue-600 font-semibold' : ''}`}
                    onClick={() => handleOpportunityClick('tenders')}
                  >
                    Tenders{opportunityCounts.tenders > 0 && ` (${opportunityCounts.tenders})`}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-4 py-2 rounded-none text-sm ${filters.opportunityTypes?.includes('internships') ? 'text-blue-600 border-blue-600 font-semibold' : ''}`}
                    onClick={() => handleOpportunityClick('internships')}
                  >
                    Internships{opportunityCounts.internships > 0 && ` (${opportunityCounts.internships})`}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-4 py-2 rounded-none text-sm ${filters.opportunityTypes?.includes('scholarships') ? 'text-blue-600 border-blue-600 font-semibold' : ''}`}
                    onClick={() => handleOpportunityClick('scholarships')}
                  >
                    Scholarships{opportunityCounts.scholarships > 0 && ` (${opportunityCounts.scholarships})`}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-4 py-2 rounded-none text-sm ${filters.opportunityTypes?.includes('education') ? 'text-blue-600 border-blue-600 font-semibold' : ''}`}
                    onClick={() => handleOpportunityClick('education')}
                  >
                    Education{opportunityCounts.education > 0 && ` (${opportunityCounts.education})`}
                  </Button>
                </div>

                {/* Mobile: Grid Layout */}
                <div className="lg:hidden">
                  {/* First Row - 4 items */}
                  <div className="grid grid-cols-4 items-center justify-items-center gap-x-2 mb-2 text-[10px]">
                    <Button 
                      variant="ghost" 
                      className="text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-2 py-2 rounded-none text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                      onClick={() => handleOpportunityClick('featured')}
                    >
                      Featured{opportunityCounts.featured > 0 && ` (${opportunityCounts.featured})`}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-2 py-2 rounded-none text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                      onClick={() => handleOpportunityClick('jobs')}
                    >
                      Jobs{opportunityCounts.jobs > 0 && ` (${opportunityCounts.jobs})`}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-2 py-2 rounded-none text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                      onClick={() => handleOpportunityClick('tenders')}
                    >
                      Tenders{opportunityCounts.tenders > 0 && ` (${opportunityCounts.tenders})`}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-2 py-2 rounded-none text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                      onClick={() => handleOpportunityClick('scholarships')}
                    >
                      Scholarships{opportunityCounts.scholarships > 0 && ` (${opportunityCounts.scholarships})`}
                    </Button>
                  </div>
                  
                  {/* Second Row - 3 items, centered */}
                  <div className="flex justify-center gap-2 text-[10px]">
                    <div className="flex justify-center gap-2 w-full max-w-md mx-auto">
                      <Button 
                        variant="ghost" 
                        className="text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-2 py-2 rounded-none text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                        onClick={() => handleOpportunityClick('education')}
                      >
                        Education{opportunityCounts.education > 0 && ` (${opportunityCounts.education})`}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="text-slate-500 hover:text-blue-600 hover:bg-transparent border-b-2 border-transparent hover:border-blue-600 transition-all px-2 py-2 rounded-none text-sm whitespace-nowrap flex-shrink-0 touch-manipulation"
                        onClick={() => handleOpportunityClick('internships')}
                      >
                        Internships{opportunityCounts.internships > 0 && ` (${opportunityCounts.internships})`}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom - Search Bar */}
            <div className="bg-slate-50 pb-6 mt-4">
              <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-slate-200/60 p-2 border border-slate-200/50">
                  <CategoryDropdownSearch />
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
        
        <div className="max-w-[95%] mx-auto px-4 py-1 mt-12">
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
                <div className="lg:sticky lg:top-4 space-y-4">
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
