"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useJobs } from "@/lib/job-context"

export function CategoryDropdownSearch() {
  const { jobs, setFilters } = useJobs()
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const categories = ["Tech & Software", "Finance & Accounting", "Healthcare", "Education & NGO", "Engineering & Construction", "Sales & Marketing", "Hospitality & Tourism", "Agriculture & Agribusiness", "Legal & Administration", "Logistics & Transport"]

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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center bg-white rounded-full shadow-md border border-slate-200 overflow-visible">
        {/* Left Side - Category Dropdown */}
        <div className="relative overflow-visible" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-6 py-3 text-slate-600 flex items-center gap-2 border-r border-slate-200 hover:bg-slate-50 rounded-l-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-inset"
          >
            <span className="text-sm font-medium">{selectedCategory}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <ul className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2">
              {categories.map((cat, index) => (
                <li key={index} className="px-4 py-3 hover:bg-[#10B981] hover:text-white cursor-pointer transition-colors" onClick={() => handleSelect(cat)}>
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
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            className="w-full pl-4 pr-12 py-3 text-slate-900 placeholder-slate-500 outline-none bg-transparent"
          />
          <Button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#10B981] hover:bg-[#059669] text-white p-2 rounded-full transition-all hover:scale-105"
            size="sm"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  )
}
