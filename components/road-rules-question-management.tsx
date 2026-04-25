"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Save, X, Clock } from "lucide-react"

interface RoadRulesQuestion {
  id: string
  question_text: string
  options: string[]
  correct_answer: string
  time_limit: number
  created_at: string
}

export function RoadRulesQuestionManagement() {
  const [questions, setQuestions] = useState<RoadRulesQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
    time_limit: 300
  })

  useEffect(() => {
    fetchRoadRulesQuestions()
  }, [])

  const fetchRoadRulesQuestions = async () => {
    try {
      const response = await fetch("/api/road-rules-questions")
      const data = await response.json()
      if (data.success) {
        setQuestions(data.questions || [])
      } else {
        setError(data.message || "Ikibazo kubona ibibazo by'amategeko")
      }
    } catch (err) {
      console.error("Fetch road rules questions error:", err)
      setError("Ikibazo gikomeye serivisi")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith("option_")) {
      const index = parseInt(field.split("_")[1])
      const newOptions = [...formData.options]
      newOptions[index] = value
      setFormData(prev => ({ ...prev, options: newOptions }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.question_text || formData.options.some(opt => !opt) || !formData.correct_answer) {
      setError("Uzuza amazina yose akenewe")
      return
    }

    try {
      const url = editingId ? `/api/road-rules-questions/${editingId}` : "/api/road-rules-questions"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        await fetchRoadRulesQuestions()
        resetForm()
        setError("")
        alert(editingId ? "Ibibazo by'amategeko byahinduwe neza!" : "Ibibazo by'amategeko byongewe neza!")
      } else {
        setError(data.message || "Ikibazo muri iki gikorwa")
      }
    } catch (err) {
      console.error("Save road rules question error:", err)
      setError("Ikibazo gikomeye serivisi")
    }
  }

  const handleEdit = (question: RoadRulesQuestion) => {
    setEditingId(question.id)
    setFormData({
      question_text: question.question_text,
      options: [...question.options],
      correct_answer: question.correct_answer,
      time_limit: question.time_limit
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this road rules question?")) {
      return
    }

    try {
      const response = await fetch(`/api/road-rules-questions/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        await fetchRoadRulesQuestions()
        alert("Ibibazo by'amategeko byasibwe neza!")
      } else {
        setError(data.message || "Ikibazo muri iki gikorwa")
      }
    } catch (err) {
      console.error("Delete road rules question error:", err)
      setError("Ikibazo gikomeye serivisi")
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      question_text: "",
      options: ["", "", "", ""],
      correct_answer: "",
      time_limit: 300
    })
    setError("")
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Road Rules Question Form */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {editingId ? "Hindura Ibibazo by'Amategeko" : "Ohereza Ibibazo Bishya by'Amategeko"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question_text">Ikibazo cy'Amategeko</Label>
            <Textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) => handleInputChange("question_text", e.target.value)}
              placeholder="Andika ikibazo cya trafiki hano..."
              className="w-full"
              required
            />
          </div>

          <div>
            <Label>Amahitamo (4)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.options.map((option, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`option_${index}`}>
                    Ihitamo {index + 1} {formData.correct_answer === option && "(✓ Igisubizo cy'ukuri)"}
                  </Label>
                  <Input
                    id={`option_${index}`}
                    value={option}
                    onChange={(e) => handleInputChange(`option_${index}`, e.target.value)}
                    placeholder={`Andika ihitamo ${index + 1}`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="correct_answer">Hitamo Igisubizo Cy'ukuri</Label>
            <select
              id="correct_answer"
              value={formData.correct_answer}
              onChange={(e) => handleInputChange("correct_answer", e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Hitamo igisubizo cy'ukuri</option>
              {formData.options.map((option, index) => (
                option && <option key={index} value={option}>Ihitamo {index + 1}: {option}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="time_limit">Igihe (iminota)</Label>
            <Input
              id="time_limit"
              type="number"
              value={formData.time_limit / 60}
              onChange={(e) => handleInputChange("time_limit", parseInt(e.target.value) * 60)}
              placeholder="5"
              min="1"
              max="60"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              {editingId ? "Hindura" : "Ohereza"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Bihagaraze
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Road Rules Questions List */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Ibibazo by'Amategeko Byose ({questions.length})
        </h3>
        
        {questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nta bibazo by'amategeko byabashyizweho</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {question.question_text}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{question.time_limit / 60} min</span>
                      </div>
                      <Badge variant="outline">
                        {new Date(question.created_at).toLocaleDateString('rw-RW')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(question)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border text-sm ${
                        option === question.correct_answer
                          ? "bg-green-50 border-green-300 text-green-800"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span className="font-medium">Ihitamo {index + 1}:</span> {option}
                      {option === question.correct_answer && " ✓"}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
