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

  const shareToWhatsApp = async (exam: any) => {
    // Track view when sharing
    await trackExamView(exam.id)

    const message = `📚 ${exam.title}

${exam.description ? exam.description + '\n\n' : ''}Category: ${exam.category}
Difficulty: ${exam.difficulty || 'Not specified'}
Duration: ${exam.duration || 'Not specified'}
Questions: ${exam.totalQuestions || 0}

Check out this exam and more!

Join our WhatsApp group:
https://chat.whatsapp.com/Ky7m3B0M5Gd3saO58Rb1tI

Follow our WhatsApp channel:
https://whatsapp.com/channel/0029Vb6oMYMCXC3SLBiRsT1r`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

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
                            {exam.difficulty && (
                              <Badge className={getDifficultyColor(exam.difficulty)}>
                                {exam.difficulty}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{exam.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="mb-4 line-clamp-2 leading-relaxed text-sm text-black dark:text-white tracking-wide">
                        {exam.description}
                      </p>

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
                      <Button
                        asChild
                        className="w-full bg-[#76c893] hover:bg-[#52b69a] text-black"
                        onClick={() => trackExamView(exam.id)}
                      >
                        <Link href={`/exams/${exam.id}/take`}>
                          Start Exam
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => shareToWhatsApp(exam)}
                        className="w-full gap-1.5 bg-[#25D366] hover:bg-[#20BA5A] text-white border-[#25D366] hover:border-[#20BA5A]"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span>WhatsApp</span>
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