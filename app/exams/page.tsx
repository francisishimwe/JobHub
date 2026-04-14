"use client"

import { useExams } from "@/lib/exam-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ExamCard } from "@/components/exam-card"
import { GraduationCap, Star, UserCheck, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ExamsPage() {
  const { exams } = useExams()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all")

  // Get unique categories and institutions
  const categories = Array.from(new Set(exams.map(exam => exam.category || 'General')))
  const institutions = Array.from(new Set(exams.map(exam => exam.institution || 'RwandaJobHub')))

  // Filter exams
  const filteredExams = exams.filter(exam => {
    const categoryMatch = selectedCategory === "all" || exam.category === selectedCategory
    const institutionMatch = selectedInstitution === "all" || exam.institution === selectedInstitution
    return categoryMatch && institutionMatch
  })

  const trackExamView = async (examId: string) => {
    try {
      await fetch('/api/track-exam-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId }),
      })
    } catch (error) {
      console.error('Error tracking exam view:', error)
    }
  }

  const handleTakeExam = (examId: string) => {
    trackExamView(examId)
  }

  const handleDownloadPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank')
  }

  const shareToWhatsApp = async (exam: any) => {
    await trackExamView(exam.id)

    const message = `*${exam.title}*

${exam.description ? exam.description + '\n\n' : ''}Category: ${exam.category}
Institution: ${exam.institution}
Difficulty: ${exam.difficulty_level || 'Not specified'}
Duration: ${exam.duration || 'Not specified'}

Check out this exam and more!

Join our WhatsApp group:
https://chat.whatsapp.com/250783074056`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Job Preparation Exams
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Test your skills and prepare for your dream job with our comprehensive assessments
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filter Exams</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution
                </label>
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Institutions</option>
                  {institutions.map(institution => (
                    <option key={institution} value={institution}>
                      {institution}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredExams.length}</span> exam{filteredExams.length !== 1 ? 's' : ''}
              {selectedCategory !== "all" && (
                <span> in <span className="font-semibold">{selectedCategory}</span></span>
              )}
              {selectedInstitution !== "all" && (
                <span> from <span className="font-semibold">{selectedInstitution}</span></span>
              )}
            </p>
          </div>

          {/* Exams Grid */}
          {filteredExams.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border">
              <GraduationCap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No exams available
              </h3>
              <p className="text-gray-600 mb-6">
                {exams.length === 0 
                  ? "Check back soon for new exams"
                  : "Try adjusting your filters to see more exams"
                }
              </p>
              {exams.length > 0 && (
                <Button
                  onClick={() => {
                    setSelectedCategory("all")
                    setSelectedInstitution("all")
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onTakeExam={handleTakeExam}
                  onDownloadPDF={handleDownloadPDF}
                />
              ))}
            </div>
          )}

          {/* Features Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Why Take Our Exams?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Skill Validation</h3>
                <p className="text-gray-600 text-sm">
                  Prove your expertise to potential employers with recognized certifications
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Industry Recognition</h3>
                <p className="text-gray-600 text-sm">
                  Certificates recognized by top companies and institutions in Rwanda
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Career Growth</h3>
                <p className="text-gray-600 text-sm">
                  Stand out in the competitive job market and advance your career
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}