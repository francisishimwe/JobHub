"use client"

import { useExams } from "@/lib/exam-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GraduationCap, Clock, UserCheck, Star, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ExamsPage() {
  const { exams } = useExams()
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800"
      case "Intermediate": return "bg-yellow-100 text-yellow-800"
      case "Advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Job Preparation Exams</h1>
            <p className="text-xl text-muted-foreground">
              Test your skills and prepare for your dream job with our comprehensive assessments
            </p>
          </div>

          {exams.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-card">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No exams available yet</h3>
              <p className="text-muted-foreground">
                Check back soon for new exams
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {exams.map((exam) => (
                <div key={exam.id} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge variant="secondary">{exam.category}</Badge>
                            <Badge className={getDifficultyColor(exam.difficulty)}>
                              {exam.difficulty}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{exam.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{exam.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {exam.topics.map((topic) => (
                          <span 
                            key={topic}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{exam.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4" />
                          <span>{exam.participants} participants</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[120px]">
                      <Button asChild className="w-full bg-[#76c893] hover:bg-[#52b69a] text-black">
                        <Link href={`/exams/${exam.id}/take`}>
                          Start Exam
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <div className="bg-primary/5 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Why Take Our Exams?</h2>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <GraduationCap className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Skill Validation</h4>
                  <p className="text-muted-foreground">Prove your expertise to potential employers</p>
                </div>
                <div>
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Industry Recognition</h4>
                  <p className="text-muted-foreground">Certificates recognized by top companies</p>
                </div>
                <div>
                  <UserCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Career Growth</h4>
                  <p className="text-muted-foreground">Stand out in the competitive job market</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}