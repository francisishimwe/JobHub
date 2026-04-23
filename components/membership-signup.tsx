"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock, Mail, Phone } from "lucide-react"

interface MembershipFormData {
  fullName: string
  phoneNumber: string
  password: string
}

export function MembershipSignup() {
  const router = useRouter()
  const [formData, setFormData] = useState<MembershipFormData>({
    fullName: "",
    phoneNumber: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPending, setShowPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/membership-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setShowPending(true)
      } else {
        setError(data.message || "Ikibazo cyo kwinjira. Mugerageze mukanya.")
      }
    } catch (err) {
      setError("Ikibazo gikomeye serivisi. Mugerageze mukanya.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof MembershipFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (showPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-6">
          <div className="text-center">
            <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Kugirango wemererwe gukora ano masuzumabumenyi, urasabwa guhamagara cg kwandikira Admin kuri (+250 783 074 056) kugirango aguhe uburenganzira. Murakoze!
            </h2>
            <p className="text-slate-600 mb-4">
              Urakunda kumenyesho, murasabwa guhamagara cg kwandikira Admin kugirango aguhe uburenganzira.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="w-full p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Iyandikishe
            </h1>
            <p className="text-slate-600">
              Kwandikira konti z'ukuri z'ukuri kugirango isuzumabumenyi y'Iga Amategeko y'Umuhanda.
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Amazina Yose</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Andika amazina yose hamwe"
                className="w-full"
                required
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Nomero ya Telefone</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="+250 7xx xxx xxx"
                className="w-full"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Ijambo</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Andika ijambo ryawe"
                className="w-full"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Kugeranya..." : "Iyandikishe"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
