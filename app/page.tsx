"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { JobCard } from "@/components/job-card"
import { AdContainer } from "@/components/ad-container"
import { useJobs } from "@/lib/job-context"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HomePage() {
  const { filteredJobs, isLoading, hasMore, loadMore } = useJobs()
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

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