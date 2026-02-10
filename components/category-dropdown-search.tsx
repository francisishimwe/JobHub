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
    
    // Update search filter based on category
    if (category === "All Categories") {
      setFilters({ search: searchQuery })
    } else {
      const fullSearch = searchQuery ? `${searchQuery} ${category}` : category
      setFilters({ search: fullSearch })
    }
  }

  const handleSearch = () => {
    if (selectedCategory === "All Categories") {
      setFilters({ search: searchQuery })
    } else {
      const fullSearch = searchQuery ? `${searchQuery} ${selectedCategory}` : selectedCategory
      setFilters({ search: fullSearch })
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
            <ul className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 py-2 max-h-80 overflow-y-auto">
              {categories.map((cat, index) => (
                <li key={index} className="px-4 py-3 hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-200 text-sm" onClick={() => handleSelect(cat)}>
                  {cat}
                </li>
              ))}
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
