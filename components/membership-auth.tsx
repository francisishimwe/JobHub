"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock } from "lucide-react"

interface AuthFormData {
  fullName: string
  phoneNumber: string
  password: string
}

type AuthMode = 'login' | 'signup'

export function MembershipAuth() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [formData, setFormData] = useState<AuthFormData>({
    fullName: "",
    phoneNumber: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      if (mode === 'signup') {
        // Signup mode
        const response = await fetch("/api/membership-signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (data.success) {
          setSuccessMessage("Konti yawe yafunguwe neza! Tegereza ko Admin ayemeza...")
          // Clear form
          setFormData({ fullName: "", phoneNumber: "", password: "" })
          // Switch to login mode after successful signup
          setTimeout(() => {
            setMode('login')
            setSuccessMessage("")
          }, 3000)
        } else {
          setError(data.message || "Ikibazo cyo kwinjira. Mugerageze mukanya.")
        }
      } else {
        // Login mode
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: formData.phoneNumber,
            password: formData.password
          }),
        })

        const data = await response.json()

        if (data.success) {
          // State A: Not approved yet - redirect to restriction notice page
          if (data.isApproved === false || data.redirectTo === '/auth/not-approved') {
            router.push('/auth/not-approved')
          } 
          // State B: Approved - redirect to exam-interview page
          else if (data.isApproved === true) {
            router.push('/exam-interview')
          }
          // Fallback: if backend provides redirectTo, use it
          else if (data.redirectTo) {
            router.push(data.redirectTo)
          }
          // Default: assume approved if no specific state provided
          else {
            router.push('/exam-interview')
          }
        } else {
          setError(data.message || "Ikibazo cyo kwinjira. Mugerageze mukanya.")
        }
      }
    } catch (err) {
      setError("Ikibazo gikomeye serivisi. Mugerageze mukanya.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setError("")
    setSuccessMessage("")
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
              {mode === 'login' ? 'Injira' : 'Iyandikishe'}
            </h1>
            <p className="text-slate-600">
              {mode === 'login' 
                ? "Injira kuri konti yawe kugirango ukore isuzumabumenyi y'Iga Amategeko y'Umuhanda."
                : "Kwandikira konti z'ukuri z'ukuri kugirango isuzumabumenyi y'Iga Amategeko y'Umuhanda."
              }
            </p>
          </div>

          {/* Mode Toggle Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`transition duration-150 px-4 py-2 rounded-md font-medium ${
                mode === 'login'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 bg-transparent'
              }`}
            >
              Injira hano (Login)
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`transition duration-150 px-4 py-2 rounded-md font-medium ${
                mode === 'signup'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 bg-transparent'
              }`}
            >
              Iyandikishe hano (Signup)
            </button>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name field - only shown in signup mode */}
            {mode === 'signup' && (
              <div>
                <Label htmlFor="fullName">Amazina Yose</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Andika amazina yose hamwe"
                  className="w-full"
                  required={mode === 'signup'}
                />
              </div>
            )}

            <div>
              <Label htmlFor="phoneNumber">Numero ya Telefone</Label>
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
              <Label htmlFor="password">Ijambo ry'ibanga</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Andika ijambo ry'ibanga"
                className="w-full"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading 
                ? "Tegereza..." 
                : (mode === 'login' ? "Injira" : "Iyandikishe")
              }
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
