"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MessageCircle, Phone, ArrowLeft } from "lucide-react"

export default function JobSubmissionSuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(15)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleWhatsAppClick = () => {
    // Replace with actual WhatsApp number
    const phoneNumber = "+250788123456" // Example Rwanda number
    const message = encodeURIComponent("Hello, I've submitted a job posting and would like to complete the verification process.")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  const handleCallClick = () => {
    // Replace with actual phone number
    window.open("tel:+250788123456")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Submission Received - Awaiting Verification
            </h1>
            <p className="text-lg text-gray-600">
              Your job has been successfully submitted.
            </p>
          </div>

          {/* Alert Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Next Step: Complete Verification
                </h3>
                <p className="text-orange-800 mb-4">
                  To complete the verification and make your post live, please contact our Admin team via WhatsApp or Phone.
                </p>
                <div className="bg-orange-100 rounded p-3">
                  <p className="text-sm text-orange-700">
                    <strong>Important:</strong> Your job will only be visible to the public after admin approval.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-6 h-6" />
              Message on WhatsApp
            </Button>

            <Button
              onClick={handleCallClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              <Phone className="w-6 h-6" />
              Call Admin
            </Button>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ol className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                <span>Contact our admin team via WhatsApp or phone to verify your submission</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                <span>Our team will review and approve your job posting</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                <span>Your job will be published and visible to job seekers</span>
              </li>
            </ol>
          </div>

          {/* Auto-redirect Notice */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              You will be automatically redirected to the homepage in{" "}
              <span className="font-semibold text-blue-600">{countdown}</span> seconds
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Homepage
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
