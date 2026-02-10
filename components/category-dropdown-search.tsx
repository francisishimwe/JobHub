"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useJobs } from "@/lib/job-context"
import { JOB_CATEGORIES } from "@/lib/constants/categories"

export function CategoryDropdownSearch() {
  const { jobs, setFilters } = useJobs()
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const categories = ["All Categories", ...JOB_CATEGORIES]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  const handleSelect = (category: string) => {
    setSelectedCategory(category)
    setIsOpen(false)
    
    // Update filter based on category
    if (category === "All Categories") {
      setFilters({ opportunityTypes: [] })
    } else {
      // Map category names to opportunity types
      const opportunityTypeMap: { [key: string]: string } = {
        "Academic": "education",
        "Accounting": "job",
        "Administration": "job",
        "Agriculture": "job",
        "Architecture": "job",
        "Arts and Design": "job",
        "Automotive": "job",
        "Aviation": "job",
        "Banking": "job",
        "Business": "job",
        "Community and Social Services": "job",
        "Computer and IT": "job",
        "Construction": "job",
        "Consultancy": "job",
        "Customer Service": "job",
        "Education": "education",
        "Energy and Utilities": "job",
        "Engineering": "job",
        "Environmental": "job",
        "Finance": "job",
        "Food Sciences": "job",
        "Geology": "job",
        "Healthcare": "job",
        "Hospitality and Tourism": "job",
        "Human Resource": "job",
        "Journalism and Media": "blog",
        "Law": "job",
        "Logistics": "job",
        "Management": "job",
        "Manufacturing and Industrial": "job",
        "Marketing and Sales": "job",
        "Mechanical Engineering": "job",
        "Medicine": "job",
        "Mining": "job",
        "NGO and International Development": "job",
        "Pharmacy": "job",
        "Procurement": "job",
        "Project Management": "job",
        "Psychology": "job",
        "Public Health": "job",
        "Real Estate": "job",
        "Research": "job",
        "Security": "job",
        "Statistics": "job",
        "Telecommunications": "job",
        "Other": "job"
      }
      
      const opportunityType = opportunityTypeMap[category] || "job"
      setFilters({ opportunityTypes: [opportunityType] })
    }
  }

  const handleSearch = () => {
    if (selectedCategory === "All Categories") {
      setFilters({ search: searchQuery, opportunityTypes: [] })
    } else {
      // Map category names to opportunity types
      const opportunityTypeMap: { [key: string]: string } = {
        "Academic": "education",
        "Accounting": "job",
        "Administration": "job",
        "Agriculture": "job",
        "Architecture": "job",
        "Arts and Design": "job",
        "Automotive": "job",
        "Aviation": "job",
        "Banking": "job",
        "Business": "job",
        "Community and Social Services": "job",
        "Computer and IT": "job",
        "Construction": "job",
        "Consultancy": "job",
        "Customer Service": "job",
        "Education": "education",
        "Energy and Utilities": "job",
        "Engineering": "job",
        "Environmental": "job",
        "Finance": "job",
        "Food Sciences": "job",
        "Geology": "job",
        "Healthcare": "job",
        "Hospitality and Tourism": "job",
        "Human Resource": "job",
        "Journalism and Media": "blog",
        "Law": "job",
        "Logistics": "job",
        "Management": "job",
        "Manufacturing and Industrial": "job",
        "Marketing and Sales": "job",
        "Mechanical Engineering": "job",
        "Medicine": "job",
        "Mining": "job",
        "NGO and International Development": "job",
        "Pharmacy": "job",
        "Procurement": "job",
        "Project Management": "job",
        "Psychology": "job",
        "Public Health": "job",
        "Real Estate": "job",
        "Research": "job",
        "Security": "job",
        "Statistics": "job",
        "Telecommunications": "job",
        "Other": "job"
      }
      
      const opportunityType = opportunityTypeMap[selectedCategory] || "job"
      setFilters({ search: searchQuery, opportunityTypes: [opportunityType] })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Left Side - Category Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-6 py-4 text-slate-700 flex items-center gap-3 border-r border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset font-medium"
          >
            <span className="text-sm">{selectedCategory}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <ul className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-[9999] py-2 max-h-80 overflow-y-auto">
              {/* Debug: Show if categories are being rendered */}
              {categories.length === 0 ? (
                <li className="px-4 py-3 text-red-500">No categories found</li>
              ) : (
                categories.map((cat, index) => (
                  <li key={index} className="px-4 py-3 hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-200 text-sm border-b border-slate-100 last:border-b-0" onClick={() => handleSelect(cat)}>
                    {cat}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Right Side - Search Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for jobs, tenders, scholarships..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            className="w-full pl-5 pr-14 py-4 text-slate-900 placeholder-slate-400 outline-none bg-transparent text-sm"
          />
          <Button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            size="sm"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
