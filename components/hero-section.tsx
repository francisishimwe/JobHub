"use client"

import { useState } from "react"
import { SearchIcon, MapPinned, X, BriefcaseBusiness, GraduationCap, Award, BookOpen, Star, FileText, Newspaper, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useJobs } from "@/lib/job-context"

export function HeroSection() {
  const { filters, setFilters, jobs, featuredCount } = useJobs()
  const [searchValue, setSearchValue] = useState("")
  const [selectedType, setSelectedType] = useState("")

  const opportunityTypes = [
    // Keep Featured tab visible; the list falls back to recent jobs if there are 0 featured items.
    { value: "All", label: "Featured", icon: Star },
    { value: "Job", label: "Jobs", icon: BriefcaseBusiness },
    { value: "Tender", label: "Tenders", icon: FileText },
    { value: "Internship", label: "Internships", icon: GraduationCap },
    { value: "Scholarship", label: "Scholarships", icon: Award },
    { value: "Education", label: "Education", icon: BookOpen },
    { value: "Blog", label: "Blogs", icon: Newspaper },
  ]

  // Calculate counts for each opportunity type
  const getCount = (type: string) => {
    if (type === "All") {
      // Featured count: return total count from API
      return featuredCount
    }
    return jobs.filter(job => job.opportunityType === type).length
  }

  const toggleOpportunityType = (type: string) => {
    if (type === "All") {
      // Clear opportunity type filter to show Featured
      setFilters({ opportunityTypes: [] })
    } else {
      // If already active, deselect it; otherwise select it
      const isActive = filters.opportunityTypes.includes(type)
      if (isActive) {
        // Deselect: clear filters (show all/featured)
        setFilters({ opportunityTypes: [] })
      } else {
        // Select: show only this type
        setFilters({ opportunityTypes: [type] })
      }
    }
  }

  const handleSearch = () => {
    setFilters({
      search: selectedType && selectedType !== "" ? `${searchValue} ${selectedType}`.trim() : searchValue,
    })
  }

  const clearSearch = () => {
    setSearchValue("")
    setSelectedType("")
    setFilters({ search: "" })
  }

  return (
    <div className="relative overflow-hidden bg-white border-b">
      <div className="container mx-auto px-3 py-3">
        {/* HeroSection simplified - no redundant search elements */}
        <div className="mx-auto max-w-4xl">
          {/* Empty section - search moved to header */}
        </div>
      </div>
    </div>
  )
}
