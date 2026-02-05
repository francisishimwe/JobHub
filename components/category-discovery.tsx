"use client"

import { useState } from "react"
import { useJobs } from "@/lib/job-context"

interface Category {
  id: string
  label: string
  icon: string
  keywords: string[]
}

const categories: Category[] = [
  {
    id: "tech",
    label: "Tech & Software",
    icon: "💻",
    keywords: ["software", "developer", "it", "tech", "programming", "engineer", "developer", "coding", "software"]
  },
  {
    id: "finance",
    label: "Finance & Accounting",
    icon: "💰",
    keywords: ["finance", "accounting", "financial", "bank", "money", "investment", "audit", "tax"]
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: "🏥",
    keywords: ["health", "medical", "doctor", "nurse", "hospital", "pharmacy", "clinical", "healthcare"]
  },
  {
    id: "education",
    label: "Education & NGO",
    icon: "🎓",
    keywords: ["education", "teaching", "school", "university", "ngo", "non-profit", "academic", "training"]
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: "🏗️",
    keywords: ["engineering", "construction", "architect", "civil", "mechanical", "electrical", "project"]
  },
  {
    id: "sales",
    label: "Sales & Marketing",
    icon: "📈",
    keywords: ["sales", "marketing", "business", "commerce", "retail", "customer", "revenue", "growth"]
  },
  {
    id: "operations",
    label: "Operations & Admin",
    icon: "⚙️",
    keywords: ["operations", "admin", "management", "office", "support", "logistics", "coordination"]
  },
  {
    id: "legal",
    label: "Legal",
    icon: "⚖️",
    keywords: ["legal", "law", "lawyer", "attorney", "court", "justice", "compliance", "regulatory"]
  },
  {
    id: "hospitality",
    label: "Hospitality",
    icon: "🏨",
    keywords: ["hospitality", "hotel", "restaurant", "tourism", "service", "food", "travel", "accommodation"]
  },
  {
    id: "agriculture",
    label: "Agriculture",
    icon: "🌱",
    keywords: ["agriculture", "farming", "agri", "crops", "livestock", "agricultural", "rural", "farm"]
  }
]

export function CategoryDiscovery() {
  const { jobs, filteredJobs, setFilters } = useJobs()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleCategoryClick = (category: Category) => {
    if (selectedCategory === category.id) {
      // Deselect if already selected
      setSelectedCategory(null)
      setFilters({ search: '' })
    } else {
      // Select new category and filter jobs
      setSelectedCategory(category.id)
      const searchQuery = category.keywords.join(" OR ")
      setFilters({ search: searchQuery })
    }
  }

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

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-6 py-4">
        {/* Desktop: Centered wrapping layout */}
        <div className="hidden lg:flex justify-center flex-wrap gap-3">
          {categories.map((category) => {
            const count = getCategoryCount(category)
            const isSelected = selectedCategory === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`
                  px-4 py-2 rounded-full border transition-all whitespace-nowrap
                  ${isSelected 
                    ? 'bg-[#10B981] text-white border-[#10B981]' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-[#10B981] hover:text-white hover:border-[#10B981]'
                  }
                `}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
                {count > 0 && (
                  <span className={`ml-2 text-xs font-semibold rounded-full px-2 py-0.5 ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Mobile: Horizontal scrolling layout */}
        <div className="lg:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2 min-w-max px-2">
            {categories.map((category) => {
              const count = getCategoryCount(category)
              const isSelected = selectedCategory === category.id
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`
                    px-4 py-2 rounded-full border transition-all whitespace-nowrap flex-shrink-0 touch-manipulation
                    ${isSelected 
                      ? 'bg-[#10B981] text-white border-[#10B981]' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-[#10B981] hover:text-white hover:border-[#10B981]'
                    }
                  `}
                >
                  <span className="mr-2">{category.icon}</span>
                  <span className="text-sm">{category.label}</span>
                  {count > 0 && (
                    <span className={`ml-2 text-xs font-semibold rounded-full px-2 py-0.5 ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Clear filter indicator */}
        {selectedCategory && (
          <div className="mt-3 text-center">
            <button
              onClick={() => {
                setSelectedCategory(null)
                setFilters({ search: '' })
              }}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Clear category filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
