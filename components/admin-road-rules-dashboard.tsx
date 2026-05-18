"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, X, Clock, User, Plus } from "lucide-react"
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
  const [assessmentNumber, setAssessmentNumber] = useState<string>("")
  const [questionText, setQuestionText] = useState("")
  const [optionA, setOptionA] = useState("")
  const [optionB, setOptionB] = useState("")
  const [optionC, setOptionC] = useState("")
  const [optionD, setOptionD] = useState("")
  const [correctAnswer, setCorrectAnswer] = useState<string>("")

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

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!assessmentNumber || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      toast({
        variant: "destructive",
        title: "Ikibazo",
        description: "Uzuza amazina yose akenewe",
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
          assessment_number: parseInt(assessmentNumber),
          question_text: questionText,
          options: [optionA, optionB, optionC, optionD],
          correct_answer: correctAnswer,
          time_limit: 300
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Byakunywe neza!",
          description: "Ikibazo cyongerwemo mu bubiko",
        })
        
        // Reset form
        setAssessmentNumber("")
        setQuestionText("")
        setOptionA("")
        setOptionB("")
        setOptionC("")
        setOptionD("")
        setCorrectAnswer("")
        setShowQuestionForm(false)
      } else {
        toast({
          variant: "destructive",
          title: "Ikibazo",
          description: data.message || "Ntibishoboka kongera ikibazo",
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ikibazo gikomeye serivisi",
        description: "Ntibishoboka kongera ikibazo",
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
              Ongera Ikibazo Kigisha
            </h2>
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <Label htmlFor="assessment">Isuzuma (1-10)</Label>
                <Select value={assessmentNumber} onValueChange={setAssessmentNumber}>
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
              </div>

              <div>
                <Label htmlFor="question">Ikibazo</Label>
                <Input
                  id="question"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Andika ikibazo hano"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="optionA">Ikibisobanuro A</Label>
                  <Input
                    id="optionA"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    placeholder="Ikibisobanuro A"
                  />
                </div>
                <div>
                  <Label htmlFor="optionB">Ikibisobanuro B</Label>
                  <Input
                    id="optionB"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    placeholder="Ikibisobanuro B"
                  />
                </div>
                <div>
                  <Label htmlFor="optionC">Ikibisobanuro C</Label>
                  <Input
                    id="optionC"
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    placeholder="Ikibisobanuro C"
                  />
                </div>
                <div>
                  <Label htmlFor="optionD">Ikibisobanuro D</Label>
                  <Input
                    id="optionD"
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    placeholder="Ikibisobanuro D"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="correctAnswer">Igikikorwa Cy'ukuri</Label>
                <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Hitamo igikikorwa cy'ukuri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={submittingQuestion} className="w-full">
                {submittingQuestion ? "Ibyakorwa..." : "Ongera Ikibazo"}
              </Button>
            </form>
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
