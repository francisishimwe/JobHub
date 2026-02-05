"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useJobs } from "@/lib/job-context"

interface Category {
  id: string
  label: string
  icon: string
  keywords: string[]
}

const categories: Category[] = [
  {
    id: "all",
    label: "All Categories",
    icon: "🔍",
    keywords: []
  },
  {
    id: "tech",
    label: "Tech & Software",
    icon: "💻",
    keywords: ["software", "developer", "it", "tech", "programming", "engineer", "coding"]
  },
  {
    id: "finance",
    label: "Finance & Accounting",
    icon: "💰",
    keywords: ["finance", "accounting", "financial", "bank", "money", "investment", "audit"]
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: "🏥",
    keywords: ["health", "medical", "doctor", "nurse", "hospital", "pharmacy", "clinical"]
  },
  {
    id: "education",
    label: "Education & NGO",
    icon: "🎓",
    keywords: ["education", "teaching", "school", "university", "ngo", "non-profit", "academic"]
  },
  {
    id: "engineering",
    label: "Engineering & Construction",
    icon: "🏗️",
    keywords: ["engineering", "construction", "architect", "civil", "mechanical", "electrical"]
  },
  {
    id: "sales",
    label: "Sales & Marketing",
    icon: "📈",
    keywords: ["sales", "marketing", "business", "commerce", "retail", "customer", "revenue"]
  },
  {
    id: "hospitality",
    label: "Hospitality & Tourism",
    icon: "🏨",
    keywords: ["hospitality", "hotel", "restaurant", "tourism", "service", "food", "travel"]
  },
  {
    id: "agriculture",
    label: "Agriculture & Agribusiness",
    icon: "🌱",
    keywords: ["agriculture", "farming", "agri", "crops", "livestock", "agricultural", "rural"]
  },
  {
    id: "legal",
    label: "Legal & Administration",
    icon: "⚖️",
    keywords: ["legal", "law", "lawyer", "attorney", "court", "justice", "compliance", "administration"]
  },
  {
    id: "logistics",
    label: "Logistics & Transport",
    icon: "🚚",
    keywords: ["logistics", "transport", "shipping", "delivery", "supply", "chain", "warehouse"]
  }
]

export function CategoryDropdownSearch() {
  const { jobs, setFilters } = useJobs()
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get job count for each category
  const getCategoryCount = (category: Category) => {
    if (!jobs || jobs.length === 0) return 0
    
    return jobs.filter(job => {
      const title = (job.title || '').toLowerCase()
      const description = (job.description || '').toLowerCase()
      const combinedText = `${title} ${description}`
      
      return category.keywords.some(keyword => 
        combinedText.includes(keyword.toLowerCase())
      )
    }).length
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDropdownOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setHighlightedIndex((prev) => (prev + 1) % categories.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setHighlightedIndex((prev) => (prev - 1 + categories.length) % categories.length)
          break
        case 'Enter':
          event.preventDefault()
          handleCategorySelect(categories[highlightedIndex])
          break
        case 'Escape':
          event.preventDefault()
          setIsDropdownOpen(false)
          inputRef.current?.focus()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDropdownOpen, highlightedIndex])

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setIsDropdownOpen(false)
    
    // Update search filter based on category
    if (category.id === 'all') {
      setFilters({ search: searchQuery })
    } else {
      const categorySearch = category.keywords.join(" OR ")
      const fullSearch = searchQuery ? `${searchQuery} ${categorySearch}` : categorySearch
      setFilters({ search: fullSearch })
    }
  }

  const handleSearch = () => {
    if (selectedCategory.id === 'all') {
      setFilters({ search: searchQuery })
    } else {
      const categorySearch = selectedCategory.keywords.join(" OR ")
      const fullSearch = searchQuery ? `${searchQuery} ${categorySearch}` : categorySearch
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
      <div className="flex items-center bg-white rounded-full shadow-md border border-slate-200 overflow-hidden">
        {/* Left Side - Category Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-6 py-3 text-slate-600 flex items-center gap-2 border-r border-slate-200 hover:bg-slate-50 rounded-l-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-inset"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            <span className="text-lg">{selectedCategory.icon}</span>
            <span className="text-sm font-medium">{selectedCategory.label}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <ul 
              className="absolute top-14 left-0 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
              role="listbox"
            >
              {categories.map((category, index) => {
                const count = getCategoryCount(category)
                return (
                  <li
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={`flex items-center justify-between gap-3 px-5 py-3 text-slate-700 hover:bg-[#10B981] hover:text-white transition-all cursor-pointer ${
                      index === highlightedIndex 
                        ? 'bg-[#10B981] text-white' 
                        : ''
                    } ${selectedCategory.id === category.id ? 'bg-slate-100 text-slate-700' : ''}`}
                    role="option"
                    aria-selected={selectedCategory.id === category.id}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                    {count > 0 && (
                      <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                        index === highlightedIndex 
                          ? 'bg-white/20 text-white' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {count}
                      </span>
                    )}
                  </li>
                )
              })}
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

      {/* Active Category Indicator */}
      {selectedCategory.id !== 'all' && (
        <div className="mt-3 flex items-center justify-center">
          <span className="text-sm text-slate-500">
            Filtering by: <span className="font-medium text-slate-700">{selectedCategory.icon} {selectedCategory.label}</span>
            <span className="ml-2 text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
              {getCategoryCount(selectedCategory)} jobs
            </span>
          </span>
          <button
            onClick={() => handleCategorySelect(categories[0])}
            className="ml-2 text-sm text-[#10B981] hover:text-[#059669] transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}
