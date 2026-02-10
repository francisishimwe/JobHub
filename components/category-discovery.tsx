"use client"

import { useState } from "react"
import { useJobs } from "@/lib/job-context"
import { JOB_CATEGORIES } from "@/lib/constants/categories"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Category {
  id: string
  label: string
  icon: string
  keywords: string[]
}

// Map professional categories to discovery categories with keywords
const categories: Category[] = [
  {
    id: "tech",
    label: "Computer and IT",
    icon: "💻",
    keywords: ["computer", "it", "software", "developer", "programming", "coding", "tech", "technology", "data", "system", "network", "cybersecurity"]
  },
  {
    id: "finance",
    label: "Finance & Banking",
    icon: "💰",
    keywords: ["finance", "banking", "accounting", "financial", "investment", "money", "audit", "tax", "credit", "bank"]
  },
  {
    id: "healthcare",
    label: "Healthcare & Medicine",
    icon: "🏥",
    keywords: ["healthcare", "medical", "medicine", "doctor", "nurse", "hospital", "pharmacy", "clinical", "health", "patient"]
  },
  {
    id: "education",
    label: "Education & Academic",
    icon: "🎓",
    keywords: ["education", "academic", "teaching", "school", "university", "research", "training", "learning", "student"]
  },
  {
    id: "engineering",
    label: "Engineering & Construction",
    icon: "🏗️",
    keywords: ["engineering", "construction", "architect", "civil", "mechanical", "electrical", "project", "building", "infrastructure"]
  },
  {
    id: "marketing",
    label: "Marketing & Sales",
    icon: "📈",
    keywords: ["marketing", "sales", "business", "commerce", "retail", "customer", "revenue", "growth", "advertising"]
  },
  {
    id: "admin",
    label: "Administration & Management",
    icon: "⚙️",
    keywords: ["administration", "admin", "management", "office", "support", "logistics", "coordination", "operations"]
  },
  {
    id: "legal",
    label: "Legal & Compliance",
    icon: "⚖️",
    keywords: ["legal", "law", "lawyer", "attorney", "court", "justice", "compliance", "regulatory", "paralegal"]
  },
  {
    id: "hospitality",
    label: "Hospitality & Tourism",
    icon: "🏨",
    keywords: ["hospitality", "tourism", "hotel", "restaurant", "service", "food", "travel", "accommodation", "event"]
  },
  {
    id: "agriculture",
    label: "Agriculture & Environment",
    icon: "🌱",
    keywords: ["agriculture", "farming", "agri", "crops", "livestock", "agricultural", "rural", "farm", "environmental", "sustainability"]
  },
  {
    id: "hr",
    label: "Human Resource",
    icon: "👥",
    keywords: ["human resource", "hr", "recruitment", "staffing", "personnel", "talent", "workforce", "employee"]
  },
  {
    id: "media",
    label: "Media & Communications",
    icon: "📺",
    keywords: ["media", "journalism", "communications", "writing", "content", "creative", "design", "arts"]
  },
  {
    id: "manufacturing",
    label: "Manufacturing & Industrial",
    icon: "🏭",
    keywords: ["manufacturing", "industrial", "production", "factory", "plant", "assembly", "machinery", "warehouse"]
  },
  {
    id: "ngo",
    label: "NGO & Social Services",
    icon: "🤝",
    keywords: ["ngo", "non-profit", "social", "community", "development", "charity", "volunteer", "humanitarian"]
  },
  {
    id: "other",
    label: "Other Categories",
    icon: "📋",
    keywords: ["other", "miscellaneous", "general", "various", "multiple", "different"]
  }
]

export function CategoryDiscovery() {
  const { jobs, filteredJobs, setFilters } = useJobs()
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    
    if (!categoryId || categoryId === "all") {
      // Clear filter
      setFilters({ search: '' })
    } else {
      // Find category and apply filter
      const category = categories.find(cat => cat.id === categoryId)
      if (category) {
        const searchQuery = category.keywords.join(" OR ")
        setFilters({ search: searchQuery })
      }
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
        <div className="flex justify-center">
          <div className="w-64">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full h-10 text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60 w-56">
                <SelectItem value="all">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm">All Categories</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {jobs?.length || 0}
                    </span>
                  </div>
                </SelectItem>
                {categories.map((category) => {
                  const count = getCategoryCount(category)
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{category.icon}</span>
                          <span className="text-sm">{category.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">
                          {count}
                        </span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            
            {/* Clear filter indicator */}
            {selectedCategory && selectedCategory !== "all" && (
              <div className="mt-2 text-center">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
