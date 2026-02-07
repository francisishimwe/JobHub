"use client"

import { useExams } from "@/lib/exam-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Clock, UserCheck, Star, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ExamList() {
  const { exams, deleteExam } = useExams()

  const shareToWhatsApp = (exam: any) => {
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
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (exams.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card">
        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No exams yet</h3>
        <p className="text-muted-foreground">
          Get started by adding your first exam
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {exams.map((exam) => (
        <div
          key={exam.id}
          className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">{exam.category}</Badge>
                    {exam.difficulty && (
                      <Badge className={getDifficultyColor(exam.difficulty)}>
                        {exam.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {exam.description && (
                <p className="mb-4 leading-relaxed text-sm text-black dark:text-white tracking-wide">
                  {exam.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                {exam.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {exam.duration}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {exam.totalQuestions || 0} questions
                </div>
                <div className="flex items-center gap-1">
                  <UserCheck className="h-4 w-4" />
                  {exam.participants} participants
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {exam.rating.toFixed(1)}
                </div>
              </div>

              {exam.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exam.topics.map((topic) => (
                    <Badge key={topic} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex lg:flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareToWhatsApp(exam)}
                className="gap-1.5 bg-[#25D366] hover:bg-[#20BA5A] text-white border-[#25D366] hover:border-[#20BA5A]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>WhatsApp</span>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the exam.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteExam(exam.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
