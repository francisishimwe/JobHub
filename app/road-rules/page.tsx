"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Play, AlertCircle, User, CreditCard, Phone } from "lucide-react"

export default function RoadRulesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)

  const handleTakeQuiz = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    
    // Check if user has quiz access (this would be checked against the database)
    if (user?.hasQuizAccess && user?.quizAccessExpiry && new Date(user.quizAccessExpiry) > new Date()) {
      router.push("/road-rules-quiz")
    } else {
      setShowPaymentInfo(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">
            IGA Amategeko y'Umuhanada
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Yiga amategeko y'umuhanda kuri iyi PDF hanyuma ukore ikizamini kugira ngo wige neza.
          </p>
        </div>

        {/* PDF Viewer Section */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold">Amategeko y'Umuhanada - PDF</h2>
            </div>
            
            <div className="bg-slate-100 rounded-lg p-4 text-center">
              <p className="text-slate-600 mb-4">
                Kugira ngo urebe PDF y'amategeko y'umuhanda, nyamuneka wakandeyo hano hepfo:
              </p>
              
              {/* Embed PDF - Replace with actual PDF URL */}
              <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 p-8">
                <div className="space-y-4">
                  <BookOpen className="h-16 w-16 text-slate-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium text-slate-700 mb-2">
                      Amategeko y'Umuhanada PDF
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Iyi PDF igufasha kumenya amategeko y'umuhanda mu Rwanda
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Vura PDF Hano
                    </Button>
                  </div>
                </div>
              </div>

              {/* Alternative: Direct PDF embed */}
              <div className="mt-6">
                <iframe
                  src="/road-rules.pdf" // Replace with actual PDF path
                  className="w-full h-96 border rounded-lg"
                  title="Road Rules PDF"
                  onError={() => {
                    console.log("PDF failed to load")
                  }}
                >
                  <p className="text-slate-600">
                    Ikibazo gikomeye: Ntago browser yawe ikora iyi iframe. 
                    <a href="/road-rules.pdf" className="text-blue-600 underline ml-2">
                      Kanda hano wakande PDF
                    </a>
                  </p>
                </iframe>
              </div>
            </div>
          </Card>
        </div>

        {/* Quiz Section */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Play className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold">Ikizamini cya Gicuti</h2>
            </div>

            <div className="text-center space-y-6">
              <p className="text-slate-600 max-w-2xl mx-auto">
                Nyuma yo kura PDF, wakora ikizamini kugira ngo ukure impano y'ubumenyi bwawe mu mategeko y'umuhanda.
              </p>

              <Button 
                size="lg"
                className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
                onClick={handleTakeQuiz}
              >
                <Play className="mr-2 h-5 w-5" />
                Kurikiza Ikizamini
              </Button>

              {/* Payment Information */}
              {showPaymentInfo && (
                <Alert className="max-w-2xl mx-auto border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="space-y-3 text-left">
                      <p className="font-semibold">
                        Kugira ngo ukore ibizamini bikumenyereza (Quiz) ndetse ubone amanota ugenda ugira, usabwa kwishyura 1000 Rwf kuri 0783074056 (ISHIMWE FRANCIS).
                      </p>
                      <p>
                        Mugihe umaze kwishyura, Andikira Admin cg umuhamagare kuri iyo nimero aguhe uburenganzira. Murakoze.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Phone className="h-4 w-4" />
                        <span className="font-mono font-bold">0783074056</span>
                        <span className="text-sm">(ISHIMWE FRANCIS)</span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Access Status */}
              {isAuthenticated && user?.hasQuizAccess && user?.quizAccessExpiry && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
                  <div className="flex items-center gap-2 text-green-800">
                    <User className="h-5 w-5" />
                    <span className="font-medium">
                      Ufite uburenganzira bukora ikizamini! 
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Uburenganzira bwarangiye: {new Date(user.quizAccessExpiry).toLocaleDateString('rw-RW')}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
