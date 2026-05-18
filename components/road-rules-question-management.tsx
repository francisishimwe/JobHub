"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Save, X, Clock, Upload } from "lucide-react"

interface RoadRulesQuestion {
  id: string
  assessment_number: number
  question_text: string
  options: string[]
  correct_answer: string
  time_limit: number
  created_at: string
}

interface QuestionFormData {
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "A" | "B" | "C" | "D"
}

export function RoadRulesQuestionManagement() {
  const [questions, setQuestions] = useState<RoadRulesQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedAssessment, setSelectedAssessment] = useState<number | null>(null)
  const [batchQuestions, setBatchQuestions] = useState<QuestionFormData[]>(
    Array.from({ length: 40 }, () => ({
      question_text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A"
    }))
  )
  const [saving, setSaving] = useState(false)

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

  const handleQuestionChange = (index: number, field: keyof QuestionFormData, value: string) => {
    const newBatchQuestions = [...batchQuestions]
    newBatchQuestions[index] = { ...newBatchQuestions[index], [field]: value as any }
    setBatchQuestions(newBatchQuestions)
  }

  const handlePrefillDemoData = () => {
    const demoData = Array.from({ length: 40 }, (_, i) => ({
      question_text: `Ikibazo cy'amategeko demo ${i + 1}`,
      option_a: `Ihitamo A kuri ikibazo ${i + 1}`,
      option_b: `Ihitamo B kuri ikibazo ${i + 1}`,
      option_c: `Ihitamo C kuri ikibazo ${i + 1}`,
      option_d: `Ihitamo D kuri ikibazo ${i + 1}`,
      correct_answer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)] as "A" | "B" | "C" | "D"
    }))
    setBatchQuestions(demoData)
  }

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedAssessment) {
      setError("Hitamo Isuzuma mbere yo kubika")
      return
    }

    const validQuestions = batchQuestions.filter(q => 
      q.question_text && q.option_a && q.option_b && q.option_c && q.option_d
    )

    if (validQuestions.length === 0) {
      setError("Uzuza amazina yose akenewe ku bibazo")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/road-rules-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assessment_number: selectedAssessment,
          questions: validQuestions.map(q => ({
            question_text: q.question_text,
            options: [q.option_a, q.option_b, q.option_c, q.option_d],
            correct_answer: q.correct_answer,
            time_limit: 300
          }))
        }),
      })

      const data = await response.json()
      if (data.success) {
        await fetchRoadRulesQuestions()
        setError("")
        alert(`${validQuestions.length} ibibazo byongewe neza!`)
        // Reset form
        setBatchQuestions(Array.from({ length: 40 }, () => ({
          question_text: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_answer: "A"
        })))
      } else {
        setError(data.message || "Ikibazo muri iki gikorwa")
      }
    } catch (err) {
      console.error("Save batch questions error:", err)
      setError("Ikibazo gikomeye serivisi")
    } finally {
      setSaving(false)
    }
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

      {/* Assessment Selector and Batch Form */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ohereza Ibibazo Bishya by'Amategeko (40)
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="assessment_number">Hitamo Isuzuma (1-10)</Label>
                <select
                  id="assessment_number"
                  value={selectedAssessment || ""}
                  onChange={(e) => setSelectedAssessment(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Hitamo isuzuma</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>Isuzuma {num}</option>
                  ))}
                </select>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handlePrefillDemoData}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Pre-fill Demo Data (Test Only)
              </Button>
            </div>
          </div>

          {selectedAssessment && (
            <form onSubmit={handleBatchSubmit} className="space-y-6">
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {batchQuestions.map((question, index) => (
                  <Card key={index} className="p-4 bg-slate-50">
                    <div className="mb-3">
                      <Label htmlFor={`question_${index}`}>
                        Ikibazo {index + 1}
                      </Label>
                      <Textarea
                        id={`question_${index}`}
                        value={question.question_text}
                        onChange={(e) => handleQuestionChange(index, "question_text", e.target.value)}
                        placeholder={`Andika ikibazo ${index + 1} hano...`}
                        className="w-full"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label htmlFor={`option_a_${index}`}>Ihitamo A</Label>
                        <Input
                          id={`option_a_${index}`}
                          value={question.option_a}
                          onChange={(e) => handleQuestionChange(index, "option_a", e.target.value)}
                          placeholder="Ihitamo A"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`option_b_${index}`}>Ihitamo B</Label>
                        <Input
                          id={`option_b_${index}`}
                          value={question.option_b}
                          onChange={(e) => handleQuestionChange(index, "option_b", e.target.value)}
                          placeholder="Ihitamo B"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`option_c_${index}`}>Ihitamo C</Label>
                        <Input
                          id={`option_c_${index}`}
                          value={question.option_c}
                          onChange={(e) => handleQuestionChange(index, "option_c", e.target.value)}
                          placeholder="Ihitamo C"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`option_d_${index}`}>Ihitamo D</Label>
                        <Input
                          id={`option_d_${index}`}
                          value={question.option_d}
                          onChange={(e) => handleQuestionChange(index, "option_d", e.target.value)}
                          placeholder="Ihitamo D"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`correct_answer_${index}`}>Igisubizo Cy'ukuri</Label>
                      <select
                        id={`correct_answer_${index}`}
                        value={question.correct_answer}
                        onChange={(e) => handleQuestionChange(index, "correct_answer", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Ibyakorwa..." : "Bika 40 Ibibazo"}
              </Button>
            </form>
          )}
        </div>
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
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Isuzuma {question.assessment_number}</Badge>
                      <h4 className="font-medium text-gray-900">
                        {question.question_text}
                      </h4>
                    </div>
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
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.options.map((option: string, index: number) => (
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
