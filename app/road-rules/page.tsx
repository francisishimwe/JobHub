"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Play, AlertCircle, User, CreditCard, Phone, CheckCircle } from "lucide-react"

export default function RoadRulesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  const handleTakeQuiz = () => {
    if (!isAuthenticated) {
      router.push("/membership-signup")
      return
    }
    
    // Check if user is approved and has valid access
    if ((user as any)?.is_approved && (user as any)?.expires_at && new Date((user as any).expires_at) > new Date()) {
      router.push("/student-exam-portal")
    } else if ((user as any)?.is_approved === false) {
      // User exists but not approved - show pending state
      router.push("/pending-approval")
    } else {
      // User access expired or not approved
      setShowPaymentInfo(true)
    }
  }

  const handleOpenPDF = () => {
    try {
      window.open('/documents/Amategeko y\'umuhanda.pdf', '_blank')
      setNotificationMessage("PDF y'amategeko y'umuhanda ifunzwe neza!")
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    } catch (error) {
      setNotificationMessage("Ikibazo cyo gufungura PDF. Mugerageze mukanya.")
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert className={notificationMessage.includes("ifunzwe") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {notificationMessage.includes("ifunzwe") ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={notificationMessage.includes("ifunzwe") ? "text-green-800" : "text-red-800"}>
              {notificationMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <Header />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-6 text-slate-900">
            IGA AMATEGEKO Y'UMUHANDA
          </h1>
          <p className="text-xl italic text-slate-600 max-w-3xl mx-auto">
            Inzira yoroshye yo kwiga no gutsinda ikizamini cy'amategeko y'umuhanda.
          </p>
        </div>

        {/* The Dual-Action Button Stack */}
        <Card className="bg-white border border-blue-50 p-8 max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Button 1 (PDF Access) */}
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-3"
              onClick={handleOpenPDF}
            >
              <BookOpen className="h-5 w-5 text-white" />
              Kanda hano ufungure PDF y'amategoko y'umuhanda
            </Button>

            {/* Button 2 (Examination) */}
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-3"
              onClick={handleTakeQuiz}
            >
              <Play className="h-5 w-5 text-white" />
              Kanda hano ukore isuzumabumenyi
            </Button>
          </div>

          {/* Payment Information - Simplified */}
          {showPaymentInfo && (
            <Alert className="mt-8 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">
                    Kugira ngo ukore ibizamini, usabwa kwishyura 1000 Rwf kuri 0783074056 (ISHIMWE FRANCIS).
                  </p>
                  <p>
                    Mugihe umaze kwishyura, umuhamagare Admin kugira ngo aguhe uburenganzira.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Access Status - Simplified */}
          {isAuthenticated && (user as any)?.hasQuizAccess && (user as any)?.quizAccessExpiry && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <div className="flex items-center gap-2 text-green-800">
                <User className="h-5 w-5" />
                <span className="font-medium">
                  Ufite uburenganzira bukora ikizamini! 
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Uburenganzira bwarangiye: {new Date((user as any).quizAccessExpiry).toLocaleDateString('rw-RW')}
              </p>
            </div>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  )
}
