"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, ChevronRight } from "lucide-react"

export function RoadRulesBanner() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/road-rules")
  }

  return (
    <Card 
      className="bg-gradient-to-br from-blue-600 to-blue-800 text-white cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg"
      onClick={handleClick}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <ChevronRight className="h-5 w-5 text-white/80" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold leading-tight">
            IGA AMATEGEKO<br/>Y'UMUHANDA
          </h3>
          <p className="text-sm text-white/90 leading-relaxed">
            Yiga kandi wige amategeko y'umuhanda<br/>
            Ukore ikizamini cya gicuti
          </p>
        </div>

        <div className="pt-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              handleClick()
            }}
          >
            Tangira none
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
