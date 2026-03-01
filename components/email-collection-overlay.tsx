"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const EMAIL_COLLECTED_KEY = "RwandaJobHub-email-collected"
const EMAIL_STORAGE_KEY = "RwandaJobHub-visitor-email"

export function EmailCollectionOverlay() {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Don't show overlay if user is logged in (admin)
    if (isAuthenticated) {
      return
    }

    // Check if email has already been collected
    const emailCollected = localStorage.getItem(EMAIL_COLLECTED_KEY)
    
    // Show overlay after 3 seconds if email hasn't been collected
    if (!emailCollected) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      // Send email to backend/database
      const response = await fetch('/api/collect-email', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }) 
      })

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        throw new Error('Server error: Invalid response format')
      }

      if (!response.ok) {
        const errorMessage = data.hint || data.details || data.error || 'Failed to subscribe'
        throw new Error(errorMessage)
      }

      // Store in localStorage to prevent showing again
      localStorage.setItem(EMAIL_STORAGE_KEY, email)
      localStorage.setItem(EMAIL_COLLECTED_KEY, "true")
      
      // Close the overlay
      setTimeout(() => {
        setIsOpen(false)
        setIsSubmitting(false)
      }, 500)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(errorMsg)
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    // Mark as collected even if skipped, so it doesn't show again
    localStorage.setItem(EMAIL_COLLECTED_KEY, "true")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-[#76c893]/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-[#76c893]" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Stay Updated with RwandaJobHub</DialogTitle>
          <DialogDescription className="text-center text-base">
            Get notified about new job opportunities and career tips directly in your inbox. 
            Join our community of job seekers!
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              className={error ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              type="submit" 
              className="w-full bg-[#76c893] hover:bg-[#76c893]/90 text-black font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe to Updates"}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full"
              onClick={handleSkip}
              disabled={isSubmitting}
            >
              Maybe Later
            </Button>
          </div>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </DialogContent>
    </Dialog>
  )
}
