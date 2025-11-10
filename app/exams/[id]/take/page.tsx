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
import { supabase } from "@/lib/supabase"
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
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [userEmail, setUserEmail] = useState("")
  const [emailSubmitted, setEmailSubmitted] = useState(false)

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
      // Fetch exam details
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .select("*")
        .eq("id", params.id)
        .single()

      if (examError) throw examError

      setExam(examData)

      // Parse duration (e.g., "90 minutes" -> 90 * 60 seconds)
      const durationMinutes = parseInt(examData.duration.split(" ")[0])
      setTimeLeft(durationMinutes * 60)

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("exam_questions")
        .select("*")
        .eq("exam_id", params.id)
        .order("order_number", { ascending: true })

      if (questionsError) throw questionsError

      // Parse options from JSONB to array
      const parsedQuestions = (questionsData || []).map((q) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }))

      setQuestions(parsedQuestions)
      setTotalPoints(parsedQuestions?.reduce((sum, q) => sum + q.points, 0) || 0)
    } catch (error) {
      console.error("Error fetching exam:", error)
    } finally {
      setLoading(false)
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
      if (answers[question.id] === question.correct_answer) {
        earnedPoints += question.points
      }
    })

    setScore(earnedPoints)
    setShowResults(true)
  }

  const handleEmailSubmit = async () => {
    if (!userEmail.trim()) return

    try {
      const percentage = (score / totalPoints) * 100

      await supabase.from("exam_submissions").insert([
        {
          exam_id: params.id,
          user_email: userEmail,
          score: score,
          total_questions: questions.length,
          percentage: percentage,
          answers: answers,
        },
      ])

      setEmailSubmitted(true)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading exam...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Exam Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This exam doesn't exist or has no questions yet.
          </p>
          <Button asChild>
            <Link href="/exams">Browse All Exams</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  if (showResults) {
    const percentage = (score / totalPoints) * 100
    const passed = percentage >= 70

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

              {!emailSubmitted ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enter your email to save your results
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-md"
                    />
                    <Button onClick={handleEmailSubmit}>Save Results</Button>
                  </div>
                </div>
              ) : (
                <p className="text-green-600 font-semibold mb-4">
                  ✓ Results saved successfully!
                </p>
              )}

              <div className="flex gap-4 mt-6">
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
              <div className={`flex items-center gap-2 text-lg font-semibold ${
                timeLeft < 300 ? 'text-red-600' : 'text-foreground'
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

            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              <div className="space-y-3">
                {Array.isArray(question.options) && question.options.map((option, index) => (
                  <label
                    key={index}
                    htmlFor={`option-${currentQuestion}-${index}`}
                    className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                      answers[question.id] === option 
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
