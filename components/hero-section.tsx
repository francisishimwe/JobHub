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
        {/* Search Bar */}
        <div className="mx-auto flex max-w-4xl flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex flex-1 items-center">
            <SearchIcon className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Job title or company name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-8 text-base border-gray-300 pl-10 pr-8 focus-visible:ring-2 focus-visible:ring-green-500"
            />
            {searchValue && (
              <button onClick={clearSearch} className="absolute right-3 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-8 text-base rounded-md border-2 border-gray-300 px-3 sm:px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Accounting">Accounting</option>
            <option value="Agronomy">Agronomy</option>
            <option value="Administration">Administration</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Procurement">Procurement</option>
            <option value="Animal science">Animal science</option>
            <option value="Auditing">Auditing</option>
            <option value="Banking">Banking</option>
            <option value="Business">Business</option>
            <option value="Catering">Catering</option>
            <option value="Civil engineering">Civil engineering</option>
            <option value="Communications">Communications</option>
            <option value="Computer and IT">Computer and IT</option>
            <option value="Consultancy">Consultancy</option>
            <option value="Demography and data analysis">Demography and data analysis</option>
            <option value="Law">Law</option>
            <option value="Education">Education</option>
            <option value="Electrical engineering">Electrical engineering</option>
            <option value="Engineering">Engineering</option>
            <option value="Environmental">Environmental</option>
            <option value="Finance">Finance</option>
            <option value="Food Sciences">Food Sciences</option>
            <option value="Geology">Geology</option>
            <option value="Management">Management</option>
            <option value="Healthy">Healthy</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Hotel">Hotel</option>
            <option value="Human resource">Human resource</option>
            <option value="International relations">International relations</option>
            <option value="Journalism">Journalism</option>
            <option value="Land management">Land management</option>
            <option value="Leisure">Leisure</option>
            <option value="Logistics">Logistics</option>
            <option value="Marketing">Marketing</option>
            <option value="Marketing and sales">Marketing and sales</option>
            <option value="Mechanical engineering">Mechanical engineering</option>
            <option value="Medicine">Medicine</option>
            <option value="Mining">Mining</option>
            <option value="Office management">Office management</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Political science">Political science</option>
            <option value="Project management">Project management</option>
            <option value="Property management">Property management</option>
            <option value="Psychology">Psychology</option>
            <option value="Public Health">Public Health</option>
            <option value="Research">Research</option>
            <option value="Secretariat">Secretariat</option>
            <option value="Social science">Social science</option>
            <option value="Statistics">Statistics</option>
            <option value="Telecommunications">Telecommunications</option>
            <option value="Water engineering">Water engineering</option>
            <option value="Vehicle Mechanical">Vehicle Mechanical</option>
            <option value="Other">Other</option>
          </select>

          <Button
            onClick={handleSearch}
            className="h-8 px-6 sm:px-8 text-base font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: '#16A34A' }}
          >
            Search
          </Button>
        </div>

        {/* Opportunity Type Filters - Tab Style */}
        <div className="mt-2 mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-2 border-b">
            {opportunityTypes.map(({ value, label, icon: Icon }) => {
              const count = getCount(value)
              const isActive = value === "All"
                ? filters.opportunityTypes.length === 0
                : filters.opportunityTypes.includes(value)

              return (
                <button
                  key={value}
                  onClick={() => toggleOpportunityType(value)}
                  className={`flex items-center gap-0.5 sm:gap-2 border-b-2 border-b-transparent px-1 py-1.5 sm:px-4 sm:py-3 text-[10px] sm:text-sm font-medium transition-colors text-blue-600 hover:text-blue-700 ${isActive ? 'underline decoration-2 underline-offset-4' : ''}`}
                >
                  <span>{label}</span>
                  <span
                    className="rounded-full px-1.5 py-0.5 sm:px-2 text-[10px] sm:text-xs font-semibold bg-red-500 text-black"
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
