"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { AdContainer } from "@/components/ad-container"
import { useJobs } from "@/lib/job-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { UserCircle2, LogOut, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronDown } from "lucide-react"

export default function HomePage() {
  const { jobs, filteredJobs, isLoading, hasMore, loadMore, filters, setFilters } = useJobs()
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "deadline">("newest")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/exams", label: "View Exams" },
    { href: "/employers", label: "Employers" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/help", label: "Help" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ]

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

    // Debug: log the jobs data
    console.log('🔍 Jobs data for counting:', jobs?.length || 0, 'jobs found')
    
    // Use the full jobs array for counting, not filteredJobs
    if (jobs && jobs.length > 0) {
      jobs.forEach((job, index) => {
        const opportunityType = job.opportunityType?.toLowerCase() || job.opportunity_type?.toLowerCase() || job.jobType?.toLowerCase() || ''
        const title = job.title?.toLowerCase() || ''
        const description = job.description?.toLowerCase() || ''
        
        // Debug: log first few jobs
        if (index < 3) {
          console.log(`📋 Job ${index}:`, {
            title: job.title,
            opportunityType: job.opportunityType || job.opportunity_type || 'N/A',
            jobType: job.jobType || 'N/A',
            featured: job.featured
          })
        }
        
        // Count by opportunity type - more inclusive matching
        if (opportunityType.includes('featured') || job.featured || title.includes('featured')) {
          counts.featured++
        }
        if (opportunityType.includes('job') || opportunityType.includes('full') || opportunityType.includes('permanent') || title.includes('job')) {
          counts.jobs++
        }
        if (opportunityType.includes('tender') || opportunityType.includes('bid') || title.includes('tender')) {
          counts.tenders++
        }
        if (opportunityType.includes('intern') || opportunityType.includes('trainee') || title.includes('intern')) {
          counts.internships++
        }
        if (opportunityType.includes('scholarship') || title.includes('scholarship')) {
          counts.scholarships++
        }
        if (opportunityType.includes('education') || opportunityType.includes('course') || title.includes('education')) {
          counts.education++
        }
        if (opportunityType.includes('blog') || opportunityType.includes('article') || title.includes('blog')) {
          counts.blogs++
        }
      })
    }

    console.log('📊 Final counts:', counts)
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
    <div className="min-h-screen bg-slate-50">
      {/* Custom Header with Break-Out Logo Box */}
      <header className="bg-[#0F172A] backdrop-blur-md border-b border-slate-200/30 sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex items-center relative py-4">
            {/* Logo Pedestal - Far Left */}
            <div className="absolute left-0 top-0 bg-white rounded-b-3xl shadow-2xl w-44 h-44 z-[100] border border-slate-100">
              <Link href="/" className="w-full h-full flex items-center justify-center p-6">
                <Image
                  src="/full logo.jpg"
                  alt="RwandaJobHub"
                  fill
                  priority
                  className="object-contain"
                />
              </Link>
            </div>

            {/* Main Navigation - Right of Logo Box */}
            <div className="flex items-center justify-between flex-1 ml-48">
              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-8 ml-80">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base font-medium text-white hover:text-blue-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center gap-6">
                {/* Login Text Link */}
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-gray-100">
                        <UserCircle2 className="h-4 w-4" />
                        <span className="hidden lg:inline">{user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleLogout} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link 
                    href="/dashboard" 
                    className="text-white hover:text-blue-300 font-medium transition-colors"
                  >
                    Login
                  </Link>
                )}

                {/* Electric Emerald Post a Job Pill */}
                <Button 
                  asChild
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2 text-sm font-medium rounded-full transition-all hover:brightness-110 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2"
                >
                  <Link href="/post-advert">
                    <span className="text-lg">+</span>
                    Post a Job
                  </Link>
                </Button>

                {/* Mobile Menu */}
                {!mounted ? (
                  <Button variant="ghost" size="sm" className="lg:hidden text-white hover:bg-gray-100">
                    <Menu className="h-5 w-5" />
                  </Button>
                ) : (
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="lg:hidden text-white hover:bg-gray-100 border border-slate-300 rounded-md p-2">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full max-w-xs pl-6 pr-4 bg-white text-slate-900 h-full sm:max-w-sm" suppressHydrationWarning>
                      <div className="flex flex-col gap-4 mt-6">
                        {navigationLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="text-base font-medium text-slate-900 hover:text-blue-600 transition-colors py-3 px-2 rounded-md"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                        
                        {/* Mobile Auth */}
                        {!isAuthenticated && (
                          <Button
                            asChild
                            className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 text-sm font-medium rounded-full transition-colors w-full"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link
                              href="/dashboard"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Login
                            </Link>
                          </Button>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* The Master Row - Consolidated Opportunity Row */}
      <div className="bg-[#0F172A] border-b border-slate-200/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-6">
            <Button 
              variant="ghost" 
              className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-4 py-2 rounded-lg font-medium"
              onClick={() => handleOpportunityClick('featured')}
            >
              Featured
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.featured}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-4 py-2 rounded-lg font-medium"
              onClick={() => handleOpportunityClick('job')}
            >
              Jobs
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.jobs}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-4 py-2 rounded-lg font-medium"
              onClick={() => handleOpportunityClick('tender')}
            >
              Tenders
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.tenders}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-4 py-2 rounded-lg font-medium"
              onClick={() => handleOpportunityClick('internship')}
            >
              Internships
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.internships}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-4 py-2 rounded-lg font-medium"
              onClick={() => handleOpportunityClick('scholarship')}
            >
              Scholarships
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.scholarships}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-4 py-2 rounded-lg font-medium"
              onClick={() => handleOpportunityClick('education')}
            >
              Education
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.education}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-white border-[#E2E8F0] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-all px-4 py-2 rounded-lg font-medium"
              onClick={() => handleOpportunityClick('blog')}
            >
              Blogs
              <span className="ml-2 bg-[#F59E0B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{opportunityCounts.blogs}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* The Search Zone - Single Command Center - Main Focus */}
      <div className="bg-slate-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl p-3 shadow-2xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="w-full bg-transparent text-slate-900 placeholder-slate-500 border-0 px-6 py-4 text-lg focus:outline-none focus:ring-0"
                />
              </div>
              <Button className="bg-[#10B981] hover:bg-[#059669] text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 py-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl mx-auto">
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-4">
               <AdContainer />
            </div>
          </aside>

          <main className="lg:col-span-8">
            <div className="max-w-4xl mx-auto">
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
                    {sortedJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}

                    {hasMore && (
                      <div className="flex justify-center mt-8 pb-10">
                        <Button 
                          onClick={loadMore} 
                          disabled={isLoading}
                          className="bg-[#003566] hover:bg-[#002850] text-white px-10 py-3 rounded-lg font-bold shadow-md transition-all"
                        >
                          {isLoading ? "Loading..." : "Load More Opportunities"}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-lg border bg-card p-12 text-center">
                    <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </main>

          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-4">
               <AdContainer />
            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </div>
  )
}