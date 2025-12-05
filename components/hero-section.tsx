"use client"

import { useState } from "react"
import { SearchIcon, MapPinned, X, BriefcaseBusiness, GraduationCap, Award, BookOpen, Star, FileText, Newspaper, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useJobs } from "@/lib/job-context"

export function HeroSection() {
  const { filters, setFilters, jobs } = useJobs()
  const [searchValue, setSearchValue] = useState("")
  const [selectedType, setSelectedType] = useState("")

  const opportunityTypes = [
    { value: "All", label: "Featured", icon: Star },
    { value: "Job", label: "Jobs", icon: BriefcaseBusiness },
    { value: "Tender", label: "Tenders", icon: FileText },
    { value: "Internship", label: "Internships", icon: GraduationCap },
    { value: "Scholarship", label: "Scholarships", icon: Award },
    { value: "Education", label: "Education", icon: BookOpen },
    { value: "Blog", label: "Blogs", icon: Newspaper },
    { value: "Announcement", label: "Announcements", icon: Megaphone },
  ]

  // Calculate counts for each opportunity type
  const getCount = (type: string) => {
    if (type === "All") {
      return jobs.length
    }
    return jobs.filter(job => job.opportunityType === type).length
  }

  const toggleOpportunityType = (type: string) => {
    if (type === "All") {
      // Clear opportunity type filter to show Featured
      setFilters({ opportunityTypes: [] })
    } else {
      // Set only the clicked type as active (single selection)
      setFilters({ opportunityTypes: [type] })
    }
  }

  const handleSearch = () => {
    const oppTypes = selectedType && selectedType !== "" ? [selectedType] : []
    setFilters({
      search: searchValue,
      opportunityTypes: oppTypes,
    })
  }

  const clearSearch = () => {
    setSearchValue("")
    setFilters({ search: "" })
  }

  return (
    <div className="relative overflow-hidden bg-white border-b">
      <div className="container mx-auto px-3 py-3">
        {/* Search Bar */}
        <div className="mx-auto flex max-w-4xl flex-row items-center gap-2">
          <div className="relative flex flex-1 items-center">
            <SearchIcon className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Job title or company name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-8 border-gray-300 pl-10 pr-8 focus-visible:ring-1 focus-visible:ring-green-500"
            />
            {searchValue && (
              <button onClick={clearSearch} className="absolute right-3 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-8 rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Featured</option>
            <option value="Job">Job</option>
            <option value="Tender">Tender</option>
            <option value="Internship">Internship</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Education">Education</option>
            <option value="Blog">Blog</option>
            <option value="Announcement">Announcement</option>
          </select>

          <Button 
            onClick={handleSearch} 
            className="h-8 px-6 text-white hover:opacity-90" 
            style={{ backgroundColor: '#16A34A' }}
          >
            Search
          </Button>
        </div>

        {/* Opportunity Type Filters - Tab Style */}
        <div className="mt-2 mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-2 border-b">
            {opportunityTypes.map(({ value, label, icon: Icon }) => {
              const count = getCount(value)
              const isActive = value === "All" 
                ? filters.opportunityTypes.length === 0 
                : filters.opportunityTypes.includes(value)

              return (
                <button
                  key={value}
                  onClick={() => toggleOpportunityType(value)}
                  className="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
                  style={{
                    borderBottomColor: isActive ? '#16A34A' : 'transparent',
                    color: isActive ? '#16A34A' : '#6B7280',
                  }}
                >
                  <span>{label}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: isActive ? '#16A34A' : '#E5E7EB',
                      color: isActive ? 'white' : '#6B7280',
                    }}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
