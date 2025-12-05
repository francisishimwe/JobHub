"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { JobCard } from "@/components/job-card"
import { JobFilters } from "@/components/job-filters"
import { useJobs } from "@/lib/job-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, BriefcaseBusiness, GraduationCap, Award } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HomePage() {
  const { filteredJobs, filters, setFilters, isLoading } = useJobs()
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "deadline">("newest")

  const opportunityTypes = [
    { value: "Job", label: "Jobs", icon: BriefcaseBusiness },
    { value: "Internship", label: "Internships", icon: GraduationCap },
    { value: "Scholarship", label: "Scholarships", icon: Award },
  ]

  const toggleOpportunityType = (type: string) => {
    const current = filters.opportunityTypes
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    setFilters({ opportunityTypes: updated })
  }

  // Sort jobs based on selected option
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      case "oldest":
        return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
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
      case "newest":
        return "Newest"
      case "oldest":
        return "Oldest"
      case "deadline":
        return "Deadline"
      default:
        return "Newest"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <div className="container mx-auto px-2 py-1 max-w-4xl">
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
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("deadline")}>
                Deadline (Soonest)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-lg border bg-card p-12 text-center">
              <p className="text-muted-foreground">Loading opportunities...</p>
            </div>
          ) : sortedJobs.length > 0 ? (
            sortedJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="rounded-lg border bg-card p-12 text-center">
              <p className="text-muted-foreground">No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
