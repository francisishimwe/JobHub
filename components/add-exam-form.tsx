"use client"

import { useState } from "react"
import { useExams } from "@/lib/exam-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Trash2, Edit } from "lucide-react"
import type { ExamQuestion } from "@/lib/types"

interface AddExamFormProps {
  onSuccess?: () => void
}

interface QuestionForm extends Omit<ExamQuestion, "id" | "examId" | "createdAt" | "orderNumber"> {
  tempId: string
}

export function AddExamForm({ onSuccess }: AddExamFormProps) {
  const { addExam } = useExams()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [duration, setDuration] = useState("")
  const [description, setDescription] = useState("")
  const [topicInput, setTopicInput] = useState("")
  const [topics, setTopics] = useState<string[]>([])
  const [questions, setQuestions] = useState<QuestionForm[]>([])
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<QuestionForm>({
    tempId: "",
    questionText: "",
    questionType: "multiple-choice",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    points: 1,
  })

  const resetQuestionForm = () => {
    setCurrentQuestion({
      tempId: "",
      questionText: "",
      questionType: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      points: 1,
    })
    setEditingIndex(null)
  }

  const handleAddTopic = () => {
    if (topicInput.trim() && !topics.includes(topicInput.trim())) {
      setTopics([...topics, topicInput.trim()])
      setTopicInput("")
    }
  }

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter((t) => t !== topic))
  }

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      alert("Please enter a question")
      return
    }

    if (currentQuestion.questionType === "multiple-choice" || currentQuestion.questionType === "true-false") {
      if (!currentQuestion.correctAnswer) {
        alert("Please select the correct answer")
        return
      }
    }

    if (currentQuestion.questionType === "short-answer") {
      if (!currentQuestion.correctAnswer.trim()) {
        alert("Please enter the correct answer for this short-answer question")
        return
      }
    }

    const newQuestion = {
      ...currentQuestion,
      tempId: editingIndex !== null ? questions[editingIndex].tempId : Date.now().toString(),
    }

    if (editingIndex !== null) {
      const updatedQuestions = [...questions]
      updatedQuestions[editingIndex] = newQuestion
      setQuestions(updatedQuestions)
    } else {
      setQuestions([...questions, newQuestion])
    }

    setShowQuestionForm(false)
    resetQuestionForm()
  }

  const handleEditQuestion = (index: number) => {
    setCurrentQuestion(questions[index])
    setEditingIndex(index)
    setShowQuestionForm(true)
  }

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])]
    newOptions[index] = value
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const handleAddOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...(currentQuestion.options || []), ""],
    })
  }

  const handleRemoveOption = (index: number) => {
    if ((currentQuestion.options?.length || 0) > 2) {
      const newOptions = currentQuestion.options?.filter((_, i) => i !== index) || []
      setCurrentQuestion({ ...currentQuestion, options: newOptions })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || questions.length === 0) {
      alert("Please fill in title and add at least one question")
      return
    }

    setLoading(true)
    try {
      const examQuestions: Omit<ExamQuestion, "id" | "examId" | "createdAt">[] = questions.map((q, index) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points,
        orderNumber: index + 1,
      }))

      await addExam({
        title,
        category,
        duration: duration || "Not specified",
        description,
        topics,
        totalQuestions: questions.length,
        totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
      }, examQuestions)

      alert("Exam added successfully!")

      // Reset form
      setTitle("")
      setCategory("")
      setDuration("")
      setDescription("")
      setTopics([])
      setQuestions([])

      onSuccess?.()
    } catch (error) {
      console.error("Error adding exam:", error)
      alert("Failed to add exam. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., JavaScript Fundamentals"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Programming"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (Optional)</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 60 minutes, 1 hour, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the exam..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topics">Topics</Label>
            <div className="flex gap-2">
              <Input
                id="topics"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTopic())}
                placeholder="Add a topic and press Enter"
              />
              <Button type="button" onClick={handleAddTopic}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="gap-1">
                  {topic}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveTopic(topic)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Questions ({questions.length})</CardTitle>
            <Button
              type="button"
              onClick={() => setShowQuestionForm(!showQuestionForm)}
              variant={showQuestionForm ? "outline" : "default"}
              className={showQuestionForm ? "" : "text-black hover:opacity-90"}
              style={showQuestionForm ? undefined : { backgroundColor: '#76c893' }}
            >
              {showQuestionForm ? "Cancel" : <><Plus className="h-4 w-4 mr-2" /> Add Question</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Question Form */}
          {showQuestionForm && (
            <Card className="border-2 border-primary">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="questionText">Question Text *</Label>
                  <Textarea
                    id="questionText"
                    value={currentQuestion.questionText}
                    onChange={(e) =>
                      setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })
                    }
                    placeholder="Enter your question..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="questionType">Question Type *</Label>
                    <Select
                      value={currentQuestion.questionType}
                      onValueChange={(value: any) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          questionType: value,
                          options: value === "true-false" ? ["True", "False"] : ["", "", "", ""],
                          correctAnswer: "",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points">Points *</Label>
                    <Input
                      id="points"
                      type="number"
                      value={currentQuestion.points}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          points: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                    />
                  </div>
                </div>

                {/* Options for Multiple Choice */}
                {currentQuestion.questionType === "multiple-choice" && (
                  <div className="space-y-2">
                    <Label>Options *</Label>
                    {(currentQuestion.options || []).map((option, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCurrentQuestion({ ...currentQuestion, correctAnswer: option })
                          }
                          className={
                            currentQuestion.correctAnswer === option
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                        >
                          {currentQuestion.correctAnswer === option ? "✓ Correct" : "Set Correct"}
                        </Button>
                        {(currentQuestion.options?.length || 0) > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOption(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={handleAddOption} size="sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Option
                    </Button>
                  </div>
                )}

                {/* Options for True/False */}
                {currentQuestion.questionType === "true-false" && (
                  <div className="space-y-2">
                    <Label>Correct Answer *</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={currentQuestion.correctAnswer === "True" ? "default" : "outline"}
                        onClick={() =>
                          setCurrentQuestion({ ...currentQuestion, correctAnswer: "True" })
                        }
                      >
                        True
                      </Button>
                      <Button
                        type="button"
                        variant={currentQuestion.correctAnswer === "False" ? "default" : "outline"}
                        onClick={() =>
                          setCurrentQuestion({ ...currentQuestion, correctAnswer: "False" })
                        }
                      >
                        False
                      </Button>
                    </div>
                  </div>
                )}

                {/* Correct Answer for Short Answer */}
                {currentQuestion.questionType === "short-answer" && (
                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Correct Answer *</Label>
                    <Input
                      id="correctAnswer"
                      value={currentQuestion.correctAnswer}
                      onChange={(e) =>
                        setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })
                      }
                      placeholder="Enter the correct answer..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Answer matching is case-insensitive and ignores extra whitespace
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                  <Textarea
                    id="explanation"
                    value={currentQuestion.explanation}
                    onChange={(e) =>
                      setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })
                    }
                    placeholder="Explain the correct answer..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowQuestionForm(false)
                      resetQuestionForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddQuestion} className="text-black hover:opacity-90" style={{ backgroundColor: '#76c893' }}>
                    {editingIndex !== null ? "Update Question" : "Add Question"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Questions List */}
          {questions.length === 0 && !showQuestionForm && (
            <div className="text-center py-8 text-muted-foreground">
              No questions added yet. Click "Add Question" to get started.
            </div>
          )}

          {questions.map((question, index) => (
            <Card key={question.tempId}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div className="flex-1">
                        <p className="font-medium mb-2">{question.questionText}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{question.questionType}</Badge>
                          <Badge variant="secondary">{question.points} points</Badge>
                        </div>
                        {question.questionType !== "short-answer" && (
                          <div className="mt-2 space-y-1">
                            {(question.options || []).map((option, i) => (
                              <div
                                key={i}
                                className={`text-sm px-2 py-1 rounded ${option === question.correctAnswer
                                  ? "bg-green-100 text-green-700 font-medium"
                                  : "text-muted-foreground"
                                  }`}
                              >
                                {option === question.correctAnswer && "✓ "}
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                        {question.questionType === "short-answer" && (
                          <div className="mt-2">
                            <div className="text-sm px-2 py-1 rounded bg-green-100 text-green-700 font-medium">
                              ✓ Correct answer: {question.correctAnswer}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditQuestion(index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading || questions.length === 0} className="text-black hover:opacity-90" style={{ backgroundColor: '#76c893' }}>
          {loading ? "Adding Exam..." : "Add Exam"}
        </Button>
      </div>
    </form>
  )
}
