"use client"

import { useState } from "react"
import { SearchIcon, MapPinned, X, BriefcaseBusiness, GraduationCap, Award, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useJobs } from "@/lib/job-context"

export function HeroSection() {
  const { filters, setFilters, jobs } = useJobs()
  const [searchValue, setSearchValue] = useState("")
  const [locationValue, setLocationValue] = useState("")

  const opportunityTypes = [
    { value: "Job", label: "Jobs", icon: BriefcaseBusiness },
    { value: "Internship", label: "Internships", icon: GraduationCap },
    { value: "Scholarship", label: "Scholarships", icon: Award },
    { value: "Education", label: "Education", icon: BookOpen },
  ]

  // Calculate counts for each opportunity type
  const getCount = (type: string) => {
    return jobs.filter(job => job.opportunityType === type).length
  }

  const toggleOpportunityType = (type: string) => {
    // Set only the clicked type as active (single selection)
    setFilters({ opportunityTypes: [type] })
  }

  const handleSearch = () => {
    setFilters({
      search: searchValue,
      location: locationValue,
    })
  }

  const clearSearch = () => {
    setSearchValue("")
    setFilters({ search: "" })
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-7">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-1 md:mt-0 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Rwanda Job Hub
          </h1>

          <div className="mx-auto flex max-w-2xl flex-col gap-2 rounded-lg bg-white p-2 shadow-lg md:flex-row">
            <div className="relative flex flex-1 items-center">
              <SearchIcon className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="border-0 pl-10 pr-8 focus-visible:ring-0"
              />
              {searchValue && (
                <button onClick={clearSearch} className="absolute right-3 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button onClick={handleSearch} className="text-black hover:opacity-90" style={{ backgroundColor: '#76c893' }}>
              Search
            </Button>
          </div>

          {/* Opportunity Type Filters */}
          <div className="mt-6 mx-auto grid grid-cols-2 md:flex md:flex-wrap md:items-center md:justify-center gap-3 max-w-md md:max-w-none">
            {opportunityTypes.map(({ value, label, icon: Icon }) => {
              const count = getCount(value)
              const isActive = filters.opportunityTypes.includes(value)

              return (
                <button
                  key={value}
                  onClick={() => toggleOpportunityType(value)}
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isActive ? '#16A34A' : 'white',
                    color: isActive ? 'white' : '#16A34A',
                    border: '2px solid #16A34A',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  <span
                    className="ml-auto rounded-md px-2 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(22, 163, 74, 0.1)',
                      color: isActive ? 'white' : '#16A34A',
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
