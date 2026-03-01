"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface ExamQuestion {
  id: string
  question_text: string
  question_type: string
  options: string[]
  correct_answer: string
  explanation: string | null
  points: number
  order_number: number
}

interface Exam {
  id: string
  title: string
  category: string
  duration: string
  difficulty: string
  description: string
}

export default function TakeExamPage() {
  const params = useParams()
  const router = useRouter()
  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [showAnswers, setShowAnswers] = useState(false)

  useEffect(() => {
    fetchExamData()
  }, [params.id])

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, showResults])

  const fetchExamData = async () => {
    try {
      // Fetch exam details and questions via API
      const response = await fetch(`/api/exams?examId=${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch exam')
      }

      setExam(data.exam)

      // Parse duration (e.g., "90 minutes" -> 90 * 60 seconds)
      const durationMinutes = parseInt(data.exam.duration.split(" ")[0])
      setTimeLeft(durationMinutes * 60)

      // Parse options from JSONB to array
      const parsedQuestions = (data.questions || []).map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }))

      setQuestions(parsedQuestions)
      setTotalPoints(parsedQuestions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0)
    } catch (error) {
      console.error("Error fetching exam:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    // Calculate score
    let earnedPoints = 0
    questions.forEach((question) => {
      const userAnswer = answers[question.id]
      const correctAnswer = question.correct_answer

      // For short-answer questions, do case-insensitive comparison and trim whitespace
      if (question.question_type === 'short-answer') {
        if (userAnswer?.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
          earnedPoints += question.points
        }
      } else {
        // For multiple-choice and true-false, exact match
        if (userAnswer === correctAnswer) {
          earnedPoints += question.points
        }
      }
    })

    setScore(earnedPoints)
    setShowResults(true)

    // Save results to database without email via API
    try {
      const percentage = (earnedPoints / totalPoints) * 100

      await fetch('/api/exams/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: params.id,
          user_email: "anonymous@user.com",
          score: earnedPoints,
          total_questions: questions.length,
          percentage: percentage,
          answers: answers,
        }),
      })
    } catch (error) {
      console.error("Error saving submission:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  // Show loading skeleton while fetching data or if exam not found
  if (isLoading || !exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border rounded-lg p-8 animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (showResults) {
    const percentage = (score / totalPoints) * 100
    const passed = percentage >= 70

    if (showAnswers) {
      // Show detailed answers and explanations
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">Exam Results & Answer Key</h1>
                    <p className="text-muted-foreground">Review your answers and explanations</p>
                  </div>
                  <Button variant="outline" onClick={() => setShowAnswers(false)}>
                    Back to Summary
                  </Button>
                </div>

                <div className="bg-muted p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-xl font-bold">{score}/{totalPoints}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Percentage</p>
                      <p className="text-xl font-bold">{percentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className={`text-xl font-bold ${passed ? 'text-green-600' : 'text-orange-600'}`}>
                        {passed ? 'Passed' : 'Not Passed'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {questions.map((question, index) => {
                    const userAnswer = answers[question.id]
                    const isCorrect = question.question_type === 'short-answer'
                      ? userAnswer?.trim().toLowerCase() === question.correct_answer.trim().toLowerCase()
                      : userAnswer === question.correct_answer

                    return (
                      <Card key={question.id} className={`p-6 ${isCorrect ? 'border-green-500 border-2' : 'border-red-500 border-2'}`}>
                        <div className="flex items-start gap-3 mb-4">
                          {isCorrect ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-lg mb-2">
                              Question {index + 1}: {question.question_text}
                            </p>
                            <p className="text-sm text-muted-foreground mb-3">
                              {question.points} point{question.points !== 1 ? 's' : ''}
                            </p>

                            <div className="space-y-2 mb-4">
                              <div className="bg-muted p-3 rounded">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Your Answer:</p>
                                <p className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                  {userAnswer || '(Not answered)'}
                                </p>
                              </div>

                              {!isCorrect && (
                                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                                  <p className="text-sm font-medium text-muted-foreground mb-1">Correct Answer:</p>
                                  <p className="font-medium text-green-700 dark:text-green-400">
                                    {question.correct_answer}
                                  </p>
                                </div>
                              )}
                            </div>

                            {question.explanation && (
                              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded border border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">Explanation:</p>
                                <p className="text-sm text-blue-800 dark:text-blue-200">{question.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>

                <div className="flex gap-4 mt-8">
                  <Button asChild className="flex-1">
                    <Link href="/exams">Back to Exams</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.location.reload()}
                  >
                    Retake Exam
                  </Button>
                </div>
              </Card>
            </div>
          </main>
          <Footer />
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center">
              <div className="mb-6">
                {passed ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                ) : (
                  <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                )}
                <h1 className="text-3xl font-bold mb-2">
                  {passed ? "Congratulations!" : "Exam Completed"}
                </h1>
                <p className="text-muted-foreground">
                  {passed
                    ? "You've successfully passed the exam!"
                    : "You've completed the exam. Keep practicing!"}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                    <p className="text-3xl font-bold">{score}/{totalPoints}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Percentage</p>
                    <p className="text-3xl font-bold">{percentage.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Questions Answered</p>
                  <p className="text-2xl font-bold">
                    {Object.keys(answers).length} / {questions.length}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setShowAnswers(true)}
                className="w-full mb-4 bg-[#76c893] hover:bg-[#52b69a] text-black"
              >
                View Answers & Explanations
              </Button>

              <div className="flex gap-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/exams">Back to Exams</Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.location.reload()}
                >
                  Retake Exam
                </Button>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{exam.title}</h1>
                <p className="text-muted-foreground">{exam.category}</p>
              </div>
              <div className={`flex items-center gap-2 text-lg font-semibold ${timeLeft < 300 ? 'text-red-600' : 'text-foreground'
                }`}>
                <Clock className="h-5 w-5" />
                {formatTime(timeLeft)}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          {/* Question Card */}
          <Card className="p-6 mb-6">
            <div className="mb-6">
              <p className="text-lg font-semibold mb-2 text-foreground">
                {currentQuestion + 1}. {question.question_text}
              </p>
              <p className="text-sm text-muted-foreground">
                {question.points} point{question.points !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Render different input types based on question type */}
            {question.question_type === 'short-answer' ? (
              // Text input for short-answer questions
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Type your answer here..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your answer in the text box above
                </p>
              </div>
            ) : (
              // Radio buttons for multiple-choice and true-false questions
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                <div className="space-y-3">
                  {Array.isArray(question.options) && question.options.map((option, index) => (
                    <label
                      key={index}
                      htmlFor={`option-${currentQuestion}-${index}`}
                      className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${answers[question.id] === option
                        ? 'border-primary bg-primary/10'
                        : 'hover:bg-muted'
                        }`}
                    >
                      <RadioGroupItem
                        value={option}
                        id={`option-${currentQuestion}-${index}`}
                      />
                      <span className="flex-1 text-foreground">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            )}
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <p className="text-sm text-muted-foreground">
              {Object.keys(answers).length} / {questions.length} answered
            </p>

            {currentQuestion === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="bg-[#76c893] hover:bg-[#52b69a] text-black"
              >
                Submit Exam
              </Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
