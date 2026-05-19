"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, X, Clock, User, Plus, Upload, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface MembershipUser {
  id: string
  full_name: string
  phone_number: string
  is_approved: boolean
  expires_at: string
  created_at: string
  quiz_access?: boolean
  quiz_access_expiry?: string
}

interface QuestionFormData {
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "A" | "B" | "C" | "D"
}

export function AdminRoadRulesDashboard() {
  const { toast } = useToast()
  const [users, setUsers] = useState<MembershipUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [extensionDays, setExtensionDays] = useState<string>("10")
  const [enableQuizAccess, setEnableQuizAccess] = useState<boolean>(true)
  
  // Question form state
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [submittingQuestion, setSubmittingQuestion] = useState(false)
  const [assessmentNumber, setAssessmentNumber] = useState<number | null>(null)
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

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/membership-users")
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users || [])
      } else {
        setError(data.message || "Ikibazo kubona abantu")
      }
    } catch (err) {
      console.error("Fetch users error:", err)
      setError("Ikibazo gikomeye serivisi - Ntibishoboka kubona abantu")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string, days: string = "10") => {
    try {
      const response = await fetch("/api/approve-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          extensionDays: parseInt(days),
          enableQuizAccess
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchUsers() // Refresh the list
        setSelectedUser(null)
      } else {
        setError(data.message || "Ikibazo kuri kugirango")
      }
    } catch (err) {
      setError("Ikibazo gikomeye serivisi")
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Weweze ukwishya gusiba uyu muri iyi uruhushya?")) {
      return
    }

    try {
      const response = await fetch("/api/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchUsers() // Refresh the list
        setSelectedUser(null)
      } else {
        setError(data.message || "Ikibazo kuri gusiba")
      }
    } catch (err) {
      setError("Ikibazo gikomeye serivisi")
    }
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
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

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!assessmentNumber) {
      toast({
        variant: "destructive",
        title: "Ikibazo",
        description: "Hitamo Isuzuma mbere yo kubika",
      })
      return
    }

    const validQuestions = batchQuestions.filter(q => 
      q.question_text && q.option_a && q.option_b && q.option_c && q.option_d
    )

    if (validQuestions.length === 0) {
      toast({
        variant: "destructive",
        title: "Ikibazo",
        description: "Uzuza amazina yose akenewe ku bibazo",
      })
      return
    }

    setSubmittingQuestion(true)
    
    try {
      const response = await fetch("/api/road-rules-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assessment_number: assessmentNumber,
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
        toast({
          title: "Byakunywe neza!",
          description: `${validQuestions.length} ibibazo byongerwemo mu bubiko`,
        })
        
        // Reset form
        setAssessmentNumber(null)
        setBatchQuestions(Array.from({ length: 40 }, () => ({
          question_text: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_answer: "A"
        })))
        setShowQuestionForm(false)
      } else {
        toast({
          variant: "destructive",
          title: "Ikibazo",
          description: data.message || "Ntibishoboka kongera ibibazo",
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ikibazo gikomeye serivisi",
        description: "Ntibishoboka kongera ibibazo",
      })
    } finally {
      setSubmittingQuestion(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Ubufatanye bwa Abanyamizi ba Iga Amategeko
          </h1>
          <p className="text-slate-600 mb-6">
            Kugirango abanyamizi bari kugira ngo uburenganzira no kuzamura.
          </p>
          
          <Button
            onClick={() => setShowQuestionForm(!showQuestionForm)}
            className="mb-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showQuestionForm ? "Funga ifishi" : "Ongera Ikibazo"}
          </Button>
        </div>

        {showQuestionForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Ohereza Ibibazo Bishya by'Amategeko (40)
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="assessment">Isuzuma (1-10)</Label>
                <Select 
                  value={assessmentNumber?.toString() || ""} 
                  onValueChange={(value) => setAssessmentNumber(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Hitamo isuzuma" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Isuzuma {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrefillDemoData}
                  className="w-full mt-4"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Pre-fill Demo Data (Test Only)
                </Button>
              </div>

              {assessmentNumber && (
                <form onSubmit={handleSubmitQuestion} className="space-y-6">
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

                  <Button type="submit" disabled={submittingQuestion} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {submittingQuestion ? "Ibyakorwa..." : "Bika 40 Ibibazo"}
                  </Button>
                </form>
              )}
            </div>
          </Card>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Abanyamizi Bari Kugirango Uburenganzira
            </h2>
            
            <div className="mb-4">
              <Label htmlFor="extension">Kongera iminsi (igihe)</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="extension"
                  type="number"
                  value={extensionDays}
                  onChange={(e) => setExtensionDays(e.target.value)}
                  placeholder="10"
                  className="w-32"
                  min="1"
                  max="365"
                />
                <span className="text-sm text-slate-600">iminsi</span>
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="quizAccess">Kwemerera Isuzumabumenyi</Label>
              <div className="flex items-center gap-2">
                <input
                  id="quizAccess"
                  type="checkbox"
                  checked={enableQuizAccess}
                  onChange={(e) => setEnableQuizAccess(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-600">Emera uyu muntu gukora isuzumabumenyi</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-500 mb-4">
                <User className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Nta banyamizi barandikishwa ubu
                </h3>
                <p className="text-slate-600">
                  Abanyamizi baza kugaragara hano nyuma yo kwiyandikisha.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Amazina</th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Nomero ya Telefone</th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Leta</th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Ubufatanye</th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Imisi</th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Isuzumabumenyi</th>
                    <th className="text-left p-3 font-semibold text-slate-900 border-b">Ibikorwa</th>
                    <th className="text-center p-3 font-semibold text-slate-900 border-b">Igikorwa</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-slate-50">
                      <td className="p-3">{user.full_name}</td>
                      <td className="p-3">{user.phone_number}</td>
                      <td className="p-3">{new Date(user.created_at).toLocaleDateString('rw-RW')}</td>
                      <td className="p-3">
                        {isExpired(user.expires_at) ? (
                          <Badge variant="destructive">Yarabuze</Badge>
                        ) : (
                          <Badge variant="default">Kiri</Badge>
                        )}
                      </td>
                      <td className="p-3">{new Date(user.expires_at).toLocaleDateString('rw-RW')}</td>
                      <td className="p-3">
                        {user.quiz_access ? (
                          <Badge variant="default" className="bg-blue-100 text-blue-800">
                            Yemewe
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            Bitewe
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {user.is_approved ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Yemewe
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <Clock className="h-3 w-3 mr-1" />
                              Isubizwe
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {!user.is_approved && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApprove(user.id, extensionDays)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Yemera
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(user.id)}
                          >
                            <X className="h-3 w-3" />
                            Gusiba
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
