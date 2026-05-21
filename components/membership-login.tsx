"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock } from "lucide-react"

interface LoginFormData {
  phoneNumber: string
  password: string
}

export function MembershipLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    phoneNumber: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // FIX: Safely extract variables from the formData state object
      const { phoneNumber, password } = formData

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, password }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.isApproved) {
          router.push("/isuzumabumenyi")
        } else if (data.redirectTo) {
          router.push(data.redirectTo)
        }
      } else {
        setError(data.message || "Ikibazo cyo kwinjira. Mugerageze mukanya.")
      }
    } catch (err) {
      console.error("Frontend Submit Error:", err)
      setError("Ikibazo gikomeye serivisi. Mugerageze mukanya.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
              Injira
            </h1>
            <p className="text-slate-600">
              Injira kuri konti yawe kugirango ukore isuzumabumenyi y'Iga Amategeko y'Umuhanda.
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
              {isLoading ? "Tegereza..." : "Injira"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Ntabwo urandikiri konti?{" "}
              <a 
                href="/membership-signup" 
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Iyandikise hano
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}