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
        {/* Search Hero - Desktop Horizontal, Mobile Rounded Box */}
        <div className="mx-auto max-w-4xl">
          {/* Desktop: Single horizontal row */}
          <div className="hidden sm:flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-xl p-1">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-10 text-sm rounded-md border-0 px-3 bg-transparent focus:outline-none focus:ring-0 min-w-[140px]"
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
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Job title or company name..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-10 text-sm border-0 bg-transparent pl-10 pr-8 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {searchValue && (
                <button onClick={clearSearch} className="absolute right-3 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              onClick={handleSearch}
              className="h-10 px-6 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
            >
              Search
            </Button>
          </div>

          {/* Mobile: Rounded box with soft shadow */}
          <div className="sm:hidden bg-white border border-gray-200 rounded-xl shadow-md p-3">
            <div className="space-y-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-10 text-sm rounded-lg border border-gray-200 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="relative">
                <SearchIcon className="absolute left-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Job title or company name..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-10 text-sm border border-gray-200 rounded-lg pl-10 pr-8 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                {searchValue && (
                  <button onClick={clearSearch} className="absolute right-3 text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <Button
                onClick={handleSearch}
                className="w-full h-10 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Modern Category Tabs - Pill Style */}
        <div className="mt-4 mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {opportunityTypes.slice(0, 3).map(({ value, label, icon: Icon }) => {
              const count = getCount(value)
              const isActive = value === "All"
                ? filters.opportunityTypes.length === 0
                : filters.opportunityTypes.includes(value)

              return (
                <button
                  key={value}
                  onClick={() => toggleOpportunityType(value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
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
