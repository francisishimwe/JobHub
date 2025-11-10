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
                    <Badge className={getDifficultyColor(exam.difficulty)}>
                      {exam.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{exam.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {exam.duration}
                </div>
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
